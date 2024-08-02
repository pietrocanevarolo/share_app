from django.urls import path
from django.urls import include

urlpatterns = [
    path('', include('api.endpoints.item.urls')),
    path('', include('api.endpoints.categories.urls')),
    ]
