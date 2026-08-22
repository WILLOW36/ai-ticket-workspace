import { useState } from "react";

function TicketDetail({
  ticket,
  onUpdate,
  onClassify,
  onAddComment,
}) {
  const [owner, setOwner] = useState(ticket.owner || "");
  const [status, setStatus] = useState(ticket.status);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpdate() {
    setLoading(true);
    setError("");

    try {
      await onUpdate({
        status,
        owner,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleClassify() {
    setLoading(true);
    setError("");

    try {
      await onClassify();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddComment(event) {
    event.preventDefault();

    if (!comment.trim()) {
      return;
    }

    setCommentLoading(true);
    setError("");

    try {
      await onAddComment(comment);
      setComment("");
    } catch (err) {
      setError(err.message);
    } finally {
      setCommentLoading(false);
    }
  }

  const hasAiData =
    ticket.category &&
    ticket.priority &&
    ticket.summary;

  return (
    <section className="card">
      <div className="section-header">
        <div>
          <h2>Ticket #{ticket.id}</h2>
          <p>{ticket.customer_name}</p>
        </div>

        <button
          type="button"
          className="button button-primary"
          onClick={handleClassify}
          disabled={loading}
        >
          {loading ? "Processing..." : "Classify with AI"}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="detail-grid">
        <div>
          <span className="detail-label">Customer</span>
          <p>{ticket.customer_name}</p>
        </div>

        <div>
          <span className="detail-label">Category</span>
          <p>{ticket.category || "Pending AI classification"}</p>
        </div>

        <div>
          <span className="detail-label">Priority</span>
          <p>{ticket.priority || "Pending AI classification"}</p>
        </div>

        <div>
          <span className="detail-label">Summary</span>
          <p>
            {ticket.summary || "Pending AI classification"}
          </p>
        </div>

        <div className="full-width">
          <span className="detail-label">Request</span>
          <p>{ticket.request_text}</p>
        </div>

        <div>
          <span className="detail-label">Attachment</span>
          {ticket.attachment_url ? (
            <a
              href={ticket.attachment_url}
              target="_blank"
              rel="noreferrer"
            >
              Open attachment
            </a>
          ) : (
            <p className="muted">No attachment</p>
          )}
        </div>

        <div>
          <span className="detail-label">Created</span>
          <p>{new Date(ticket.created_at).toLocaleString()}</p>
        </div>
      </div>

      {hasAiData && (
        <div className="ai-result">
          <strong>AI classification ready</strong>
          <span>
            {ticket.category} · {ticket.priority}
          </span>
        </div>
      )}

      <hr />

      <div className="edit-grid">
        <label>
          Status
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="NEW">New</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
        </label>

        <label>
          Owner
          <input
            value={owner}
            onChange={(event) => setOwner(event.target.value)}
            placeholder="Logistics Team"
          />
        </label>

        <div className="form-actions">
          <button
            type="button"
            className="button button-secondary"
            onClick={handleUpdate}
            disabled={loading}
          >
            Save changes
          </button>
        </div>
      </div>

      <hr />

      <div>
        <h3>Comments</h3>

        {ticket.comments?.length ? (
          <div className="comments-list">
            {ticket.comments.map((item) => (
              <div key={item.id} className="comment">
                <p>{item.content}</p>
                <small>
                  {new Date(item.created_at).toLocaleString()}
                </small>
              </div>
            ))}
          </div>
        ) : (
          <p className="muted">No comments yet.</p>
        )}

        <form
          onSubmit={handleAddComment}
          className="comment-form"
        >
          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            rows="3"
            placeholder="Add a comment..."
          />

          <button
            type="submit"
            className="button button-primary"
            disabled={commentLoading}
          >
            {commentLoading ? "Adding..." : "Add Comment"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default TicketDetail;