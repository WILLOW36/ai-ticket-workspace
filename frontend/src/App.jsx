import { useEffect, useState } from "react";

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
  const [showForm, setShowForm] = useState(false);
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

  const selectedTicket =
    tickets.find((ticket) => ticket.id === selectedTicketId) || null;

  async function handleCreateTicket(data) {
    const newTicket = await createTicket(data);

    setTickets((current) => [newTicket, ...current]);
    setSelectedTicketId(newTicket.id);
    setShowForm(false);
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

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="eyebrow">AI-FIRST WORKSPACE</span>
          <h1>AI Ticket Workspace</h1>
          <p>Operational ticket management powered by AI</p>
        </div>

        <button
          className="button button-primary"
          onClick={() => setShowForm(true)}
        >
          + New Ticket
        </button>
      </header>

      {error && <div className="global-error">{error}</div>}

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

      <main className="workspace">
        {loading ? (
          <section className="card loading-card">
            Loading tickets...
          </section>
        ) : (
          <div className="workspace-grid">
            <aside className="ticket-panel">
              <TicketList
                tickets={tickets}
                selectedTicketId={selectedTicketId}
                onSelect={(ticket) =>
                  setSelectedTicketId(ticket.id)
                }
              />
            </aside>

            <section className="detail-panel">
              {selectedTicket ? (
                <TicketDetail
                  ticket={selectedTicket}
                  onUpdate={handleUpdateTicket}
                  onClassify={handleClassifyTicket}
                  onAddComment={handleAddComment}
                />
              ) : (
                <div className="card empty-detail">
                  <h2>Select a ticket</h2>
                  <p>
                    Choose a ticket from the list to view its details.
                  </p>
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;