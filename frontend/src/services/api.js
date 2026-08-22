const API_BASE_URL = "http://localhost:8000/api";

async function request(url, options = {}) {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error || data?.detail || "An error occurred while calling the API."
    );
  }

  return data;
}

export function getTickets() {
  return request("/tickets/");
}

export function createTicket(ticket) {
  return request("/tickets/", {
    method: "POST",
    body: JSON.stringify(ticket),
  });
}

export function updateTicket(ticketId, data) {
  return request(`/tickets/${ticketId}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function classifyTicket(ticketId) {
  return request(`/tickets/${ticketId}/classify/`, {
    method: "POST",
  });
}

export function addComment(ticketId, content) {
  return request(`/tickets/${ticketId}/comments/`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}