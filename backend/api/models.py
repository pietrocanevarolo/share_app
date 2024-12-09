from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractUser, Group, Permission
from PIL import Image

class CustomUser(AbstractUser):
    address = models.CharField(max_length=255, blank=True, null=True)
    tax_code = models.CharField(max_length=16, unique=True, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    items = models.ManyToManyField('Item', related_name='items_users')
    favourite_items = models.ManyToManyField('Item', related_name='favourite_items_users')

    # Override groups and user_permissions to avoid conflicts
    groups = models.ManyToManyField(
        Group,
        related_name='customuser_set',  # Specify a unique related_name
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        related_query_name='customuser',
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='customuser_set',  # Specify a unique related_name
        blank=True,
        help_text='Specific permissions for this user.',
        related_query_name='customuser',
    )

    def __str__(self):
        return self.username
    
class Category(models.Model):
    name = models.CharField(max_length=255)
    parent = models.ForeignKey('self', related_name='subcategories', on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.name

class Item(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField()
    is_shared = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    category = models.ForeignKey(Category, related_name='items', on_delete=models.CASCADE)


    def __str__(self):
        return self.name
    
class ItemImage(models.Model):
    item = models.ForeignKey(Item, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='item_images/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.item.name} uploaded at {self.uploaded_at}"


class Chat(models.Model):
    item = models.ForeignKey(Item, related_name='chats', on_delete=models.CASCADE)
    users = models.ManyToManyField(CustomUser)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_message = models.ForeignKey('Message', null=True, blank=True, on_delete=models.SET_NULL, related_name='last_in_chat')
    
    def __str__(self):
        return f"Chat for {self.item.name} involving {', '.join([user.username for user in self.users.all()])}"

    def mark_all_messages_as_read(self, user):
        """Mark all messages in the chat as read by the user."""
        self.messages.filter(is_read=False, recipient=user).update(is_read=True)



class Message(models.Model):
    chat = models.ForeignKey(Chat, related_name='messages', on_delete=models.CASCADE)
    sender = models.ForeignKey(CustomUser, related_name='sent_messages', on_delete=models.CASCADE)
    recipient = models.ForeignKey(CustomUser, related_name='received_messages', on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_read = models.BooleanField(default=False)
    images = models.ManyToManyField('MessageImage', related_name='messages', blank=True)
    
    def __str__(self):
        return f"Message from {self.sender.username} to {self.recipient.username} on {self.created_at}"

    def mark_as_read(self):
        """Mark this message as read."""
        self.is_read = True
        self.save()

class MessageImage(models.Model):
    image = models.ImageField(upload_to='message_images/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Image uploaded at {self.uploaded_at}"

    def resize_image(self, size=(1024, 1024)):
        """Resize the image to the specified size."""
        image = Image.open(self.image)
        image.thumbnail(size)
        image.save(self.image.path)

class NotificationType(models.Model):
    """
    Modello che rappresenta i tipi di notifica. 
    Ogni tipo può essere associato a più notifiche.
    """
    name = models.CharField(max_length=50, unique=True)  # Nome univoco del tipo di notifica
    description = models.TextField(blank=True, null=True)  # Descrizione del tipo di notifica
    icon = models.ImageField(upload_to='notification_icons/', blank=True, null=True)  # Icona opzionale
    color = models.CharField(max_length=7, default='#ffffff')  # Colore associato alla notifica, es. #FF5733

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Notification Type"
        verbose_name_plural = "Notification Types"

class Notification(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.ForeignKey(NotificationType, on_delete=models.CASCADE)
    message = models.ForeignKey('Message', null=True, blank=True, on_delete=models.CASCADE, related_name='notifications')
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    payload = models.JSONField(null=True, blank=True)  # Dati extra della notifica (ad esempio, chat_id)

    def __str__(self):
        return f'Notification for {self.user.username} - {self.notification_type.name}'

    def mark_as_read(self):
        self.is_read = True
        self.save()