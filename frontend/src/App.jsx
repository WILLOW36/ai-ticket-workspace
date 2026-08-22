import { useEffect, useMemo, useState } from "react";

import TicketDetail from "./components/TicketDetail";
import TicketForm from "./components/TicketForm";
import TicketList from "./components/TicketList";

import {
  addComment,
  classifyTicket,
  createTicket,
  getTickets,
  updateTicket,
} from "./services/api";

function App() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [activeView, setActiveView] = useState("dashboard");
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadTickets() {
    setLoading(true);
    setError("");

    try {
      const data = await getTickets();
      const ticketList = Array.isArray(data) ? data : [];

      setTickets(ticketList);

      if (ticketList.length > 0 && selectedTicketId === null) {
        setSelectedTicketId(ticketList[0].id);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTickets();
  }, []);

  const filteredTickets = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return tickets;
    }

    return tickets.filter((ticket) =>
      [
        ticket.customer_name,
        ticket.request_text,
        ticket.category,
        ticket.priority,
        ticket.status,
        ticket.owner,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(normalizedSearch)
        )
    );
  }, [tickets, searchTerm]);

  const selectedTicket =
    tickets.find((ticket) => ticket.id === selectedTicketId) || null;

  const metrics = useMemo(() => {
    const total = tickets.length;

    const pendingAi = tickets.filter(
      (ticket) =>
        !ticket.category ||
        !ticket.priority ||
        !ticket.summary
    ).length;

    const highPriority = tickets.filter(
      (ticket) => ticket.priority === "High"
    ).length;

    const inProgress = tickets.filter(
      (ticket) => ticket.status === "IN_PROGRESS"
    ).length;

    return {
      total,
      pendingAi,
      highPriority,
      inProgress,
    };
  }, [tickets]);

  async function handleCreateTicket(data) {
    const newTicket = await createTicket(data);

    setTickets((current) => [newTicket, ...current]);
    setSelectedTicketId(newTicket.id);
    setShowForm(false);
    setActiveView("all-tickets");
  }

  async function handleUpdateTicket(data) {
    const updatedTicket = await updateTicket(
      selectedTicket.id,
      data
    );

    setTickets((current) =>
      current.map((ticket) =>
        ticket.id === updatedTicket.id ? updatedTicket : ticket
      )
    );
  }

  async function handleClassifyTicket() {
    const updatedTicket = await classifyTicket(
      selectedTicket.id
    );

    setTickets((current) =>
      current.map((ticket) =>
        ticket.id === updatedTicket.id ? updatedTicket : ticket
      )
    );
  }

  async function handleAddComment(content) {
    const newComment = await addComment(
      selectedTicket.id,
      content
    );

    setTickets((current) =>
      current.map((ticket) =>
        ticket.id === selectedTicket.id
          ? {
              ...ticket,
              comments: [
                ...(ticket.comments || []),
                newComment,
              ],
            }
          : ticket
      )
    );
  }

  function handleSelectTicket(ticket) {
    setSelectedTicketId(ticket.id);
    setActiveView("all-tickets");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="sidebar-eyebrow">AI-FIRST WORKSPACE</span>
          <h1>AI Ticket</h1>
          <span>Workspace</span>
        </div>

        <nav className="sidebar-nav">
          <button
            type="button"
            className={
              activeView === "dashboard"
                ? "nav-item nav-item-active"
                : "nav-item"
            }
            onClick={() => setActiveView("dashboard")}
          >
            <span className="nav-icon">▦</span>
            Dashboard
          </button>

          <button
            type="button"
            className={
              activeView === "all-tickets"
                ? "nav-item nav-item-active"
                : "nav-item"
            }
            onClick={() => setActiveView("all-tickets")}
          >
            <span className="nav-icon">▤</span>
            All Tickets
          </button>
        </nav>

        <button
          type="button"
          className="sidebar-create-button"
          onClick={() => setShowForm(true)}
        >
          + Create Ticket
        </button>
      </aside>

      <section className="main-layout">
        <header className="topbar">
          <div className="topbar-title">
            <span>
              {activeView === "dashboard"
                ? "Ticket Workspace"
                : "All Tickets"}
            </span>
          </div>

          <div className="topbar-actions">
            <div className="search-box">
              <span className="search-icon">⌕</span>

              <input
                type="search"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
              />
            </div>

            <button className="icon-button" type="button">
              ♧
            </button>

            <button className="icon-button" type="button">
              ?
            </button>

            <div className="user-avatar">WA</div>
          </div>
        </header>

        {error && <div className="global-error">{error}</div>}

        <main className="main-content">
          {loading ? (
            <section className="dashboard-card loading-card">
              Loading workspace...
            </section>
          ) : activeView === "dashboard" ? (
            <>
              <section className="metrics-grid">
                <div className="metric-card">
                  <span>Total Tickets</span>
                  <strong>{metrics.total}</strong>
                  <small>All registered tickets</small>
                </div>

                <div className="metric-card">
                  <span>Pending AI</span>
                  <strong>{metrics.pendingAi}</strong>
                  <small>Waiting for classification</small>
                </div>

                <div className="metric-card metric-card-blue">
                  <span>High Priority</span>
                  <strong>{metrics.highPriority}</strong>
                  <small>Immediate attention required</small>
                </div>

                <div className="metric-card metric-card-red">
                  <span>In Progress</span>
                  <strong>{metrics.inProgress}</strong>
                  <small>Currently being handled</small>
                </div>
              </section>

              <section className="dashboard-card recent-tickets-card">
                <div className="card-heading">
                  <div>
                    <h2>Recent Tickets</h2>
                    <p>Latest operational requests</p>
                  </div>

                  <button
                    type="button"
                    className="view-all-button"
                    onClick={() =>
                      setActiveView("all-tickets")
                    }
                  >
                    VIEW ALL →
                  </button>
                </div>

                <TicketList
                  tickets={filteredTickets.slice(0, 8)}
                  selectedTicketId={selectedTicketId}
                  onSelect={handleSelectTicket}
                  compact
                />
              </section>

              {selectedTicket && (
                <section className="dashboard-card selected-ticket-card">
                  <TicketDetail
                    ticket={selectedTicket}
                    onUpdate={handleUpdateTicket}
                    onClassify={handleClassifyTicket}
                    onAddComment={handleAddComment}
                  />
                </section>
              )}
            </>
          ) : (
            <section className="all-tickets-layout">
              <TicketList
                tickets={filteredTickets}
                selectedTicketId={selectedTicketId}
                onSelect={handleSelectTicket}
              />

              {selectedTicket && (
                <TicketDetail
                  ticket={selectedTicket}
                  onUpdate={handleUpdateTicket}
                  onClassify={handleClassifyTicket}
                  onAddComment={handleAddComment}
                />
              )}
            </section>
          )}
        </main>
      </section>

      {showForm && (
        <div className="modal-backdrop">
          <div className="modal">
            <TicketForm
              onCreated={handleCreateTicket}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;