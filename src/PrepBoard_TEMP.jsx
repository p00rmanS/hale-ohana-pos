function PrepBoard({
  filteredPrepOrders,
  completedOrders,
  prepFilter,
  setPrepFilter,
  statuses,
  updatePrepStatus,
  markOrderDone,
  getStatusCardClass,
  getStatusBadgeClass,
  flashingOrderIds,
}) {
  return (
    <section className="prep-section">
      <h2 className="section-title">Active Prep Orders</h2>

      <div className="filter-tabs">
        {['All', 'Drinks', 'Food'].map((filter) => (
          <button
            key={filter}
            onClick={() => setPrepFilter(filter)}
            className={`filter-tab ${prepFilter === filter ? 'filter-tab-active' : ''}`}
          >
            {filter}
          </button>
        ))}
      </div>

      {filteredPrepOrders.length === 0 ? (
        <div className="empty-prep-box">
          <p className="empty-prep-text">No active prep orders in this view</p>
        </div>
      ) : (
        <div className="prep-grid">
          {filteredPrepOrders.map((order) => (
            <div
              key={order.id}
              className={`prep-card ${getStatusCardClass(order.status)} ${
                flashingOrderIds.includes(order.id) ? 'prep-card-flash' : ''
              }`}
            >
              <div className="prep-card-header">
                <div>
                  <p className="prep-area">{order.area}</p>
                  <p className="prep-item-name">{order.name}</p>
                </div>

                <span
                  className={`prep-status-badge ${getStatusBadgeClass(order.status)}`}
                >
                  {order.status}
                </span>
              </div>

              <p className="prep-category">{order.category}</p>
              <p className="prep-details">{order.details}</p>
              <p className="prep-time">Sent: {order.createdAt}</p>

              <div className="status-buttons-wrap">
                {statuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => updatePrepStatus(order.id, status)}
                    className={`status-button ${order.status === status ? 'status-button-active' : ''}`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <button
                className="done-button"
                onClick={() => markOrderDone(order.id)}
              >
                Mark Done
              </button>
            </div>
          ))}
        </div>
      )}

      <h2 className="section-title completed-title">Recently Done</h2>

      {completedOrders.length === 0 ? (
        <div className="empty-prep-box">
          <p className="empty-prep-text">No completed orders yet</p>
        </div>
      ) : (
        <div className="completed-list">
          {completedOrders.map((order) => (
            <div key={order.id} className="completed-card">
              <div>
                <p className="completed-main-title">
                  {order.area} — {order.name}
                </p>
                <p className="completed-details">{order.details}</p>
                <p className="completed-category">{order.category}</p>
              </div>

              <div className="completed-times">
                <p className="completed-time">Sent: {order.createdAt}</p>
                <p className="completed-time">Done: {order.completedAt}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default PrepBoard