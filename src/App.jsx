import { useEffect, useState } from 'react'
import './App.css'
import PrepBoard from './PrepBoard'
import OrderEntry from './OrderEntry'
import { db } from './firebase'
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore'

const areas = [
  'Orchid',
  'Ilima',
  'Gardenia 1',
  'Gardenia 2',
  'Ginger',
  'Crown',
  'BOP',
  'Hibiscus',
]

const statuses = ['New', 'Received', 'Making', 'Ready']
const taroQuickPax = [2, 4, 6, 8, 10]
const mangoQuickQty = [1, 2]
const keikiOptions = [
  'Fries Only',
  'Chicken Tenders Only',
  'Mac and Cheese Only',
  'Whole Plate',
]

function getCategory(itemName) {
  if (itemName === 'Mango Smoothie' || itemName === 'Smoothie Refill') {
    return 'Drinks'
  }

  if (itemName === 'Taro Rolls' || itemName === 'Keiki Meal') {
    return 'Food'
  }

  return 'Other'
}

function getStatusCardClass(status) {
  if (status === 'New') return 'status-card-new'
  if (status === 'Received') return 'status-card-received'
  if (status === 'Making') return 'status-card-making'
  if (status === 'Ready') return 'status-card-ready'
  return ''
}

function getStatusBadgeClass(status) {
  if (status === 'New') return 'status-badge-new'
  if (status === 'Received') return 'status-badge-received'
  if (status === 'Making') return 'status-badge-making'
  if (status === 'Ready') return 'status-badge-ready'
  return ''
}

function App() {
  const [selectedView, setSelectedView] = useState('entry')
  const [selectedArea, setSelectedArea] = useState('')
  const [orderItems, setOrderItems] = useState([])
  const [activeItem, setActiveItem] = useState('')
  const [prepOrders, setPrepOrders] = useState([])
  const [completedOrders, setCompletedOrders] = useState([])
  const [prepFilter, setPrepFilter] = useState('All')
  const [flashingOrderIds, setFlashingOrderIds] = useState([])

  const [taroRows, setTaroRows] = useState([{ id: 1, tables: 1, pax: 2 }])
  const [mangoRows, setMangoRows] = useState([{ id: 1, qty: 1, serve: 'Glass' }])

  useEffect(() => {
    const unsubscribeActive = onSnapshot(collection(db, 'orders'), (snapshot) => {
      const orders = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }))

      orders.sort((a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0))
      setPrepOrders(orders)

      const newIds = snapshot
        .docChanges()
        .filter((change) => change.type === 'added')
        .map((change) => change.doc.id)

      if (newIds.length > 0) {
        setFlashingOrderIds((prev) => [...new Set([...prev, ...newIds])])

        setTimeout(() => {
          setFlashingOrderIds((prev) =>
            prev.filter((id) => !newIds.includes(id))
          )
        }, 4000)
      }
    })

    const unsubscribeCompleted = onSnapshot(
      collection(db, 'completedOrders'),
      (snapshot) => {
        const doneOrders = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }))

        doneOrders.sort((a, b) => (b.completedAtMs || 0) - (a.completedAtMs || 0))
        setCompletedOrders(doneOrders)
      }
    )

    return () => {
      unsubscribeActive()
      unsubscribeCompleted()
    }
  }, [])

  const addItemToOrder = (name, details) => {
    const newItem = {
      id: Date.now() + Math.random(),
      name,
      details,
      category: getCategory(name),
    }

    setOrderItems((prev) => [...prev, newItem])
    setActiveItem('')
  }

  const removeItem = (id) => {
    setOrderItems((prev) => prev.filter((item) => item.id !== id))
  }

  const clearOrder = () => {
    setOrderItems([])
    setActiveItem('')
  }

  const handleSendOrder = async () => {
    if (!selectedArea) {
      alert('Please select a server area first.')
      return
    }

    if (orderItems.length === 0) {
      alert('Please add at least one item.')
      return
    }

    try {
      const now = new Date()
      const createdAtLabel = now.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
      })
      const createdAtMs = now.getTime()

      for (const item of orderItems) {
        await addDoc(collection(db, 'orders'), {
          area: selectedArea,
          name: item.name,
          details: item.details,
          category: item.category,
          status: 'New',
          createdAt: createdAtLabel,
          createdAtMs,
        })
      }

      setOrderItems([])
      setActiveItem('')
      setSelectedView('prep')
      alert('Order sent successfully!')
    } catch (error) {
      console.error(error)
      alert('Error sending order')
    }
  }

  const updatePrepStatus = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, 'orders', id), {
        status: newStatus,
      })
    } catch (error) {
      console.error(error)
      alert('Error updating status')
    }
  }

  const markOrderDone = async (id) => {
    try {
      const orderToMove = prepOrders.find((order) => order.id === id)
      if (!orderToMove) return

      const now = new Date()
      const completedAtLabel = now.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
      })
      const completedAtMs = now.getTime()

      await addDoc(collection(db, 'completedOrders'), {
        area: orderToMove.area,
        name: orderToMove.name,
        details: orderToMove.details,
        category: orderToMove.category,
        status: 'Done',
        createdAt: orderToMove.createdAt,
        createdAtMs: orderToMove.createdAtMs || 0,
        completedAt: completedAtLabel,
        completedAtMs,
      })

      await deleteDoc(doc(db, 'orders', id))
    } catch (error) {
      console.error(error)
      alert('Error marking order done')
    }
  }

  const addTaroRow = () => {
    setTaroRows((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), tables: 1, pax: 2 },
    ])
  }

  const updateTaroRow = (id, field, value) => {
    setTaroRows((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, [field]: Number(value) } : row
      )
    )
  }

  const removeTaroRow = (id) => {
    if (taroRows.length === 1) return
    setTaroRows((prev) => prev.filter((row) => row.id !== id))
  }

  const handleAddTaroRequest = () => {
    const details = taroRows
      .map((row) => `${row.tables} table(s) of ${row.pax}`)
      .join(' • ')

    addItemToOrder('Taro Rolls', details)
  }

  const addMangoRow = () => {
    setMangoRows((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), qty: 1, serve: 'Glass' },
    ])
  }

  const updateMangoRow = (id, field, value) => {
    setMangoRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? { ...row, [field]: field === 'qty' ? Number(value) : value }
          : row
      )
    )
  }

  const removeMangoRow = (id) => {
    if (mangoRows.length === 1) return
    setMangoRows((prev) => prev.filter((row) => row.id !== id))
  }

  const handleAddMangoRequest = () => {
    const details = mangoRows
      .map((row) => `${row.qty} ${row.serve.toLowerCase()}`)
      .join(' • ')

    addItemToOrder('Mango Smoothie', details)
  }

  const filteredPrepOrders =
    prepFilter === 'All'
      ? prepOrders
      : prepOrders.filter((order) => order.category === prepFilter)

  return (
    <div className="page">
      <header className="header">
        <h1 className="title">Hale Ohana POS</h1>
        <p className="subtitle">
          {selectedView === 'entry' ? 'Order Entry' : 'Prep Board'}
        </p>
      </header>

      <div className="view-tabs">
        <button
          onClick={() => setSelectedView('entry')}
          className={`view-tab ${selectedView === 'entry' ? 'view-tab-active' : ''}`}
        >
          Order Entry
        </button>

        <button
          onClick={() => setSelectedView('prep')}
          className={`view-tab ${selectedView === 'prep' ? 'view-tab-active' : ''}`}
        >
          Prep Board
        </button>
      </div>

      {selectedView === 'entry' ? (
        <OrderEntry
          areas={areas}
          selectedArea={selectedArea}
          setSelectedArea={setSelectedArea}
          activeItem={activeItem}
          setActiveItem={setActiveItem}
          addItemToOrder={addItemToOrder}
          handleAddMangoRequest={handleAddMangoRequest}
          handleAddTaroRequest={handleAddTaroRequest}
          addMangoRow={addMangoRow}
          removeMangoRow={removeMangoRow}
          updateMangoRow={updateMangoRow}
          mangoRows={mangoRows}
          mangoQuickQty={mangoQuickQty}
          addTaroRow={addTaroRow}
          removeTaroRow={removeTaroRow}
          updateTaroRow={updateTaroRow}
          taroRows={taroRows}
          taroQuickPax={taroQuickPax}
          keikiOptions={keikiOptions}
          orderItems={orderItems}
          removeItem={removeItem}
          clearOrder={clearOrder}
          handleSendOrder={handleSendOrder}
        />
      ) : (
        <PrepBoard
          filteredPrepOrders={filteredPrepOrders}
          completedOrders={completedOrders}
          prepFilter={prepFilter}
          setPrepFilter={setPrepFilter}
          statuses={statuses}
          updatePrepStatus={updatePrepStatus}
          markOrderDone={markOrderDone}
          getStatusCardClass={getStatusCardClass}
          getStatusBadgeClass={getStatusBadgeClass}
          flashingOrderIds={flashingOrderIds}
        />
      )}
    </div>
  )
}

export default App