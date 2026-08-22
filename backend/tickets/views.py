from django.shortcuts import get_object_or_404

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Comment, Ticket
from .serializers import CommentSerializer, TicketSerializer


class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer

    @action(
        detail=True,
        methods=["post"],
        url_path="comments",
    )
    def add_comment(self, request, pk=None):
        ticket = self.get_object()

        serializer = CommentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        comment = serializer.save(ticket=ticket)

        return Response(
            CommentSerializer(comment).data,
            status=status.HTTP_201_CREATED,
        )