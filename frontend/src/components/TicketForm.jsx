import { useState } from "react";

function TicketForm({ onCreated, onCancel }) {
  const [form, setForm] = useState({
    customer_name: "",
    request_text: "",
    attachment_url: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await onCreated(form);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-content">
      <div className="modal-header">
        <div>
          <span className="panel-eyebrow">NEW REQUEST</span>
          <h2>New Ticket</h2>
          <p>Create an operational request.</p>
        </div>

        <button
          type="button"
          className="close-button"
          onClick={onCancel}
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className="ticket-form">
        <div className="form-row">
          <label>
            Customer name
            <input
              name="customer_name"
              value={form.customer_name}
              onChange={handleChange}
              required
              placeholder="Company Example Corp"
            />
          </label>

          <label>
            Attachment URL
            <input
              name="attachment_url"
              type="url"
              value={form.attachment_url}
              onChange={handleChange}
              placeholder="https://example.com/document.pdf"
            />
          </label>
        </div>

        <label>
          Request
          <textarea
            name="request_text"
            value={form.request_text}
            onChange={handleChange}
            required
            rows="5"
            placeholder="Describe the customer's request..."
          />
        </label>

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        <div className="modal-actions">
          <button
            type="button"
            className="button button-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="button button-primary"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Ticket"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TicketForm;