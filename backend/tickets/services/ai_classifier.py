import os
from typing import Literal

from google import genai
from google.genai import types
from pydantic import BaseModel

from tickets.models import Ticket


class TicketClassification(BaseModel):
    category: Literal[
        "Administrative",
        "Support",
        "Accounting",
        "Logistics",
    ]
    priority: Literal[
        "High",
        "Medium",
        "Low",
    ]
    summary: str


class AIClassifierService:
    def __init__(self):
        self.provider = os.getenv("AI_PROVIDER", "mock").lower()

    def classify(self, ticket: Ticket) -> TicketClassification:
        if self.provider == "mock":
            return self._classify_with_mock(ticket)

        if self.provider == "gemini":
            return self._classify_with_gemini(ticket)

        raise ValueError(
            f"Unsupported AI_PROVIDER: {self.provider}"
        )

    def _classify_with_mock(
        self,
        ticket: Ticket,
    ) -> TicketClassification:
        request = ticket.request_text.lower()

        if any(
            keyword in request
            for keyword in [
                "order",
                "delivery",
                "shipment",
                "shipping",
                "pedido",
                "entrega",
                "envío",
            ]
        ):
            return TicketClassification(
                category="Logistics",
                priority="High",
                summary=(
                    "The request is related to an undelivered "
                    "order or shipment."
                ),
            )

        if any(
            keyword in request
            for keyword in [
                "invoice",
                "payment",
                "billing",
                "factura",
                "pago",
                "contabilidad",
            ]
        ):
            return TicketClassification(
                category="Accounting",
                priority="Medium",
                summary=(
                    "The request is related to accounting "
                    "or billing information."
                ),
            )

        if any(
            keyword in request
            for keyword in [
                "support",
                "technical",
                "error",
                "help",
                "soporte",
                "error técnico",
            ]
        ):
            return TicketClassification(
                category="Support",
                priority="Medium",
                summary=(
                    "The request requires support or "
                    "technical assistance."
                ),
            )

        return TicketClassification(
            category="Administrative",
            priority="Low",
            summary=(
                "The request is related to a general "
                "administrative process."
            ),
        )

    def _classify_with_gemini(
        self,
        ticket: Ticket,
    ) -> TicketClassification:
        api_key = os.getenv("GEMINI_API_KEY")

        if not api_key:
            raise ValueError(
                "GEMINI_API_KEY is required when "
                "AI_PROVIDER=gemini."
            )

        client = genai.Client(api_key=api_key)

        prompt = f"""
You classify operational tickets for an internal workspace.

Allowed categories:
- Administrative
- Support
- Accounting
- Logistics

Allowed priorities:
- High
- Medium
- Low

Customer:
{ticket.customer_name}

Request:
{ticket.request_text}

Generate a concise summary in one sentence.
"""

        response = client.models.generate_content(
            model="gemini-3.5-flash-lite",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=TicketClassification,
            ),
        )

        if response.parsed is None:
            raise ValueError(
                "The AI response could not be parsed."
            )

        return response.parsed