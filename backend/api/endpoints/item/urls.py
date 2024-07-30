from django.urls import path

from api.endpoints.item.views import ItemListAPIView

urlpatterns = [
    path('item/',ItemListAPIView.as_view(),
         name='item-list'),

]
