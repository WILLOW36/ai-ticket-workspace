import os
from typing import Literal

from google import genai
from google.genai import types
from pydantic import BaseModel

from tickets.models import Ticket


class TicketClassification(BaseModel):
    category: Literal[
        "Administrative",
        "Accounting",
        "Logistics",
        "Support",
    ]
    priority: Literal[
        "High",
        "Medium",
        "Low",
    ]
    summary: str


class AIClassifierService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")

        if not api_key:
            raise ValueError("GEMINI_API_KEY is not configured.")

        self.client = genai.Client(api_key=api_key)

    def classify(self, ticket: Ticket) -> TicketClassification:
        prompt = f"""
You classify operational tickets for an internal company workspace.

Allowed categories:
- Administrative
- Accounting
- Logistics
- Support

Allowed priorities:
- High
- Medium
- Low

Classify this ticket:

Customer:
{ticket.customer_name}

Request:
{ticket.request_text}

Rules:
- Select exactly one category.
- Select exactly one priority.
- Generate a concise summary in one sentence.
"""

        response = self.client.models.generate_content(
            model="gemini-3.5-flash-lite",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=TicketClassification,
            ),
        )

        if response.parsed is None:
            raise ValueError("The AI response could not be parsed.")

        return response.parsed