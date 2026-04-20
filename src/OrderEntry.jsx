function OrderEntry({
  areas,
  selectedArea,
  setSelectedArea,
  activeItem,
  setActiveItem,
  addItemToOrder,
  handleAddMangoRequest,
  handleAddTaroRequest,
  addMangoRow,
  removeMangoRow,
  updateMangoRow,
  mangoRows,
  mangoQuickQty,
  addTaroRow,
  removeTaroRow,
  updateTaroRow,
  taroRows,
  taroQuickPax,
  keikiOptions,
  orderItems,
  removeItem,
  clearOrder,
  handleSendOrder,
}) {
  return (
    <>
      <section className="area-section">
        <h2 className="section-title">Servers / Areas</h2>

        <div className="area-grid">
          {areas.map((area) => (
            <button
              key={area}
              onClick={() => setSelectedArea(area)}
              className={`area-card ${selectedArea === area ? 'area-card-active' : ''}`}
            >
              <div className="area-card-top">
                <span className="area-name">{area}</span>
                <span
                  className={`status-badge ${selectedArea === area ? 'status-badge-active' : ''}`}
                >
                  {selectedArea === area ? 'Selected' : 'Waiting'}
                </span>
              </div>

              <p className="area-subtext">
                {selectedArea === area
                  ? 'Ready for order entry'
                  : 'Tap to select area'}
              </p>
            </button>
          ))}
        </div>
      </section>

      <main className="main">
        <section className="menu-section">
          <h2 className="section-title">Menu</h2>

          <div className="menu-grid">
            <button className="menu-button" onClick={() => setActiveItem('keiki')}>
              Keiki Meal
            </button>

            <button className="menu-button" onClick={() => setActiveItem('mango')}>
              Mango Smoothie
            </button>

            <button className="menu-button" onClick={() => setActiveItem('taro')}>
              Taro Rolls
            </button>

            <button
              className="menu-button"
              onClick={() => addItemToOrder('Smoothie Refill', 'Needs refill')}
            >
              Smoothie Refill
            </button>
          </div>

          {activeItem === 'keiki' && (
            <div className="option-box">
              <h3 className="option-title">Keiki Meal Options</h3>

              <div className="tap-grid">
                {keikiOptions.map((option) => (
                  <button
                    key={option}
                    className="tap-option-button"
                    onClick={() => addItemToOrder('Keiki Meal', option)}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="option-actions">
                <button
                  className="cancel-button"
                  onClick={() => setActiveItem('')}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {activeItem === 'mango' && (
            <div className="option-box">
              <h3 className="option-title">Mango Smoothie Request</h3>

              {mangoRows.map((row, index) => (
                <div key={row.id} className="request-row">
                  <div className="request-row-header">
                    <p className="request-row-title">Request {index + 1}</p>
                    <button
                      className="small-remove-button"
                      onClick={() => removeMangoRow(row.id)}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="request-field">
                    <label className="label">Quick Quantity</label>
                    <div className="quick-tap-row">
                      {mangoQuickQty.map((qty) => (
                        <button
                          key={qty}
                          onClick={() => updateMangoRow(row.id, 'qty', qty)}
                          className={`quick-tap-button ${row.qty === qty ? 'quick-tap-button-active' : ''}`}
                        >
                          {qty}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="request-fields">
                    <div className="request-field">
                      <label className="label">Custom Quantity</label>
                      <input
                        type="number"
                        min="1"
                        value={row.qty}
                        onChange={(e) =>
                          updateMangoRow(row.id, 'qty', e.target.value)
                        }
                        className="input"
                      />
                    </div>

                    <div className="request-field">
                      <label className="label">Serve In</label>
                      <div className="quick-tap-row">
                        {['Glass', 'Pineapple'].map((serve) => (
                          <button
                            key={serve}
                            onClick={() => updateMangoRow(row.id, 'serve', serve)}
                            className={`quick-tap-button ${row.serve === serve ? 'quick-tap-button-active' : ''}`}
                          >
                            {serve}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="option-actions">
                <button className="secondary-button" onClick={addMangoRow}>
                  + Add Another Smoothie Row
                </button>
              </div>

              <div className="option-actions">
                <button className="add-button" onClick={handleAddMangoRequest}>
                  Add Mango Smoothie
                </button>

                <button
                  className="cancel-button"
                  onClick={() => setActiveItem('')}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {activeItem === 'taro' && (
            <div className="option-box">
              <h3 className="option-title">Taro Rolls Request</h3>

              {taroRows.map((row, index) => (
                <div key={row.id} className="request-row">
                  <div className="request-row-header">
                    <p className="request-row-title">Request {index + 1}</p>
                    <button
                      className="small-remove-button"
                      onClick={() => removeTaroRow(row.id)}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="request-field">
                    <label className="label">How Many Tables?</label>
                    <input
                      type="number"
                      min="1"
                      value={row.tables}
                      onChange={(e) =>
                        updateTaroRow(row.id, 'tables', e.target.value)
                      }
                      className="input"
                    />
                  </div>

                  <div className="request-field">
                    <label className="label">Quick Pax Tap</label>
                    <div className="quick-tap-row">
                      {taroQuickPax.map((pax) => (
                        <button
                          key={pax}
                          onClick={() => updateTaroRow(row.id, 'pax', pax)}
                          className={`quick-tap-button ${row.pax === pax ? 'quick-tap-button-active' : ''}`}
                        >
                          {pax}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="request-field">
                    <label className="label">Custom Pax</label>
                    <input
                      type="number"
                      min="1"
                      value={row.pax}
                      onChange={(e) =>
                        updateTaroRow(row.id, 'pax', e.target.value)
                      }
                      className="input"
                    />
                  </div>
                </div>
              ))}

              <div className="option-actions">
                <button className="secondary-button" onClick={addTaroRow}>
                  + Add Another Taro Row
                </button>
              </div>

              <div className="option-actions">
                <button className="add-button" onClick={handleAddTaroRequest}>
                  Add Taro Rolls
                </button>

                <button
                  className="cancel-button"
                  onClick={() => setActiveItem('')}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="summary-section">
          <h2 className="section-title">Current Order</h2>

          <div className="summary-box">
            <p className="summary-text">
              <strong>Area:</strong> {selectedArea || 'None selected'}
            </p>

            {orderItems.length === 0 ? (
              <p className="summary-text">No items yet</p>
            ) : (
              <div className="order-items-wrap">
                {orderItems.map((item) => (
                  <div key={item.id} className="order-card">
                    <div>
                      <p className="order-name">{item.name}</p>
                      {item.details ? (
                        <p className="order-details">{item.details}</p>
                      ) : null}
                      <p className="order-category">{item.category}</p>
                    </div>

                    <button
                      className="remove-button"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bottom-actions">
            <button className="clear-button" onClick={clearOrder}>
              Clear Order
            </button>

            <button className="send-button" onClick={handleSendOrder}>
              Send Order
            </button>
          </div>
        </section>
      </main>
    </>
  )
}

export default OrderEntry