function TicketList({
  tickets,
  selectedTicketId,
  onSelect,
  compact = false,
}) {
  return (
    <div className={compact ? "ticket-table compact" : "ticket-table"}>
      {tickets.length === 0 ? (
        <div className="empty-state">
          No tickets found.
        </div>
      ) : (
        <div className="ticket-table-scroll">
          <table>
            <thead>
              <tr>
                <th>CLIENT</th>
                <th>AI SUMMARY</th>
                <th>CATEGORY</th>
                <th>PRIORITY</th>
                <th>STATUS</th>
              </tr>
            </thead>

            <tbody>
              {tickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className={
                    selectedTicketId === ticket.id
                      ? "ticket-row ticket-row-active"
                      : "ticket-row"
                  }
                  onClick={() => onSelect(ticket)}
                >
                  <td>
                    <div className="client-cell">
                      <div className="client-avatar">
                        {ticket.customer_name
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>

                      <span>{ticket.customer_name}</span>
                    </div>
                  </td>

                  <td>
                    <div className="summary-cell">
                      <span className="summary-spark">✦</span>

                      <span>
                        {ticket.summary ||
                          ticket.request_text ||
                          "Pending AI classification"}
                      </span>
                    </div>
                  </td>

                  <td>
                    <span className="category-badge">
                      {ticket.category || "Pending AI"}
                    </span>
                  </td>

                  <td>
                    {ticket.priority ? (
                      <span
                        className={`priority-badge priority-${ticket.priority.toLowerCase()}`}
                      >
                        <span>●</span>
                        {ticket.priority}
                      </span>
                    ) : (
                      <span className="muted">—</span>
                    )}
                  </td>

                  <td>
                    <span
                      className={`status-text status-${ticket.status.toLowerCase()}`}
                    >
                      {ticket.status.replace("_", " ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TicketList;