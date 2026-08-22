from rest_framework import serializers

from .models import Comment, Ticket


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = [
            "id",
            "content",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
        ]


class TicketSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Ticket
        fields = [
            "id",
            "customer_name",
            "request_text",
            "attachment_url",
            "category",
            "priority",
            "summary",
            "status",
            "owner",
            "created_at",
            "updated_at",
            "comments",
        ]
        read_only_fields = [
            "id",
            "category",
            "priority",
            "summary",
            "created_at",
            "updated_at",
            "comments",
        ]