from rest_framework import serializers
from .models import Item,CustomUser,ItemImage,Category,MessageImage,Message,Chat, Notification, NotificationType

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email']

class ItemImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemImage
        fields = ['id', 'image', 'uploaded_at']

class ItemSerializer(serializers.ModelSerializer):
    images = ItemImageSerializer(many=True, read_only=True)
    class Meta:
        model = Item
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class MessageImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessageImage
        fields = ['id', 'image', 'uploaded_at']

class MessageSerializer(serializers.ModelSerializer):
    sender = CustomUserSerializer(read_only=True)
    recipient = CustomUserSerializer(read_only=True)
    images = MessageImageSerializer(many=True, read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'chat', 'sender', 'recipient', 'content', 'created_at', 'is_read', 'images']

    def create(self, validated_data):
        """Override to automatically link the chat, sender, and recipient."""
        chat = validated_data['chat']
        sender = validated_data['sender']
        recipient = validated_data['recipient']
        content = validated_data['content']

        message = Message.objects.create(
            chat=chat,
            sender=sender,
            recipient=recipient,
            content=content
        )
        return message

class ChatSerializer(serializers.ModelSerializer):
    users = CustomUserSerializer(many=True, read_only=True)
    last_message = MessageSerializer(read_only=True)

    class Meta:
        model = Chat
        fields = ['id', 'item', 'users', 'created_at', 'updated_at', 'last_message']

class NotificationTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationType
        fields = ['id', 'name', 'description', 'icon', 'color']

class NotificationSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)
    notification_type = NotificationTypeSerializer(read_only=True)
    message = MessageSerializer(read_only=True)

    class Meta:
        model = Notification
        fields = ['id', 'user', 'notification_type', 'message', 'is_read', 'created_at', 'payload']

    def update(self, instance, validated_data):
        """Mark notification as read."""
        instance.is_read = True
        instance.save()
        return instance