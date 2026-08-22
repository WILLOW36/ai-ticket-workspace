from django.db import models


class Ticket(models.Model):
    class Status(models.TextChoices):
        NEW = "NEW", "New"
        IN_PROGRESS = "IN_PROGRESS", "In Progress"
        RESOLVED = "RESOLVED", "Resolved"
        CLOSED = "CLOSED", "Closed"

    class Category(models.TextChoices):
        ADMINISTRATIVE = "ADMINISTRATIVE", "Administrative"
        ACCOUNTING = "ACCOUNTING", "Accounting"
        LOGISTICS = "LOGISTICS", "Logistics"
        SUPPORT = "SUPPORT", "Support"

    class Priority(models.TextChoices):
        HIGH = "HIGH", "High"
        MEDIUM = "MEDIUM", "Medium"
        LOW = "LOW", "Low"

    customer_name = models.CharField(max_length=150)
    request_text = models.TextField()
    attachment_url = models.URLField(blank=True)
    category = models.CharField(
        max_length=20,
        choices=Category.choices,
        blank=True,
    )
    priority = models.CharField(
        max_length=10,
        choices=Priority.choices,
        blank=True,
    )
    summary = models.CharField(max_length=500, blank=True)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.NEW,
    )
    owner = models.CharField(max_length=150, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Ticket #{self.pk} - {self.customer_name}"


class Comment(models.Model):
    ticket = models.ForeignKey(
        Ticket,
        related_name="comments",
        on_delete=models.CASCADE,
    )
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"Comment #{self.pk} for Ticket #{self.ticket_id}"