function TicketList({ tickets, selectedTicketId, onSelect }) {
  return (
    <section className="card ticket-list-card">
      <div className="panel-header">
        <div>
          <span className="panel-eyebrow">WORKSPACE</span>
          <h2>Tickets</h2>
        </div>

        <span className="ticket-count">{tickets.length}</span>
      </div>

      {tickets.length === 0 ? (
        <div className="empty-state">
          No tickets have been created yet.
        </div>
      ) : (
        <div className="ticket-list">
          {tickets.map((ticket) => (
            <button
              type="button"
              key={ticket.id}
              className={`ticket-item ${
                selectedTicketId === ticket.id
                  ? "ticket-item-active"
                  : ""
              }`}
              onClick={() => onSelect(ticket)}
            >
              <div className="ticket-item-top">
                <strong>{ticket.customer_name}</strong>

                <span className="ticket-number">
                  #{ticket.id}
                </span>
              </div>

              <div className="ticket-item-meta">
                <span>
                  {ticket.category || "Pending AI"}
                </span>

                <span>
                  {ticket.priority || "—"}
                </span>
              </div>

              <div className="ticket-item-bottom">
                <span className="status-badge">
                  {ticket.status.replace("_", " ")}
                </span>

                <span className="ticket-date">
                  {new Date(
                    ticket.created_at
                  ).toLocaleDateString()}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

export default TicketList;