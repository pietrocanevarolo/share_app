from django.urls import path

from api.endpoints.chat.views import ChatViewSet, MessageViewSet, NotificationViewSet, NotificationTypeViewSet

urlpatterns = [
    path('chat/', ChatViewSet.as_view({'get': 'list', 'post': 'create'}), name='chat-list'),
    path('chat/<int:pk>/', ChatViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='chat-detail'),
    path('message/', MessageViewSet.as_view({'get': 'list', 'post': 'create'}), name='message-list'),
    path('message/<int:pk>/', MessageViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='message-detail'),
    path('notification/', NotificationViewSet.as_view({'get': 'list', 'post': 'create'}), name='notification-list'),
    path('notification/<int:pk>/', NotificationViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='notification-detail'),
    path('notification-type/', NotificationTypeViewSet.as_view({'get': 'list', 'post': 'create'}), name='notification-type-list'),
    path('notification-type/<int:pk>/', NotificationTypeViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='notification-type-detail'),
]
