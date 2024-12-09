from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from api.models import Chat, Message, Notification, NotificationType
from api.serializers import ChatSerializer, MessageSerializer, NotificationSerializer, NotificationTypeSerializer


class ChatViewSet(viewsets.ModelViewSet):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer

    def create(self, request, *args, **kwargs):
        """
        Metodo per gestire la creazione di una nuova chat
        """
        # Ottenere i dati inviati nel corpo della richiesta
        serializer = self.get_serializer(data=request.data)
        
        # Verifica se i dati sono validi
        if serializer.is_valid():
            # Salva l'oggetto Chat nel database
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            # Se i dati non sono validi, rispondi con errori di validazione
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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


    def perform_create(self, serializer):
        """Override create method to link the message with the current user."""
        chat = serializer.validated_data['chat']
        sender = self.request.user
        recipient = serializer.validated_data['recipient']
        serializer.save(sender=sender, recipient=recipient)

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer


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
