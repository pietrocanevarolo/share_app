from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from api.models import Chat, Message, Notification, NotificationType
from api.serializers import ChatSerializer, MessageSerializer, NotificationSerializer, NotificationTypeSerializer
from rest_framework.permissions import IsAuthenticated

class ChatViewSet(viewsets.ModelViewSet):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return chats for the current user only."""
        return self.queryset.filter(users=self.request.user)

    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        """Get all messages for a chat."""
        chat = self.get_object()
        messages = chat.messages.all()
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        """Override create method to link the message with the current user."""
        chat = serializer.validated_data['chat']
        sender = self.request.user
        recipient = serializer.validated_data['recipient']
        serializer.save(sender=sender, recipient=recipient)

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return notifications for the current user only."""
        return self.queryset.filter(user=self.request.user)

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """Mark the notification as read."""
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

class NotificationTypeViewSet(viewsets.ModelViewSet):
    queryset = NotificationType.objects.all()
    serializer_class = NotificationTypeSerializer
    permission_classes = [IsAuthenticated]