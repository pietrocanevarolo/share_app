from django.urls import path

from api.endpoints.categories.views import CategoriesListAPIView

urlpatterns = [
    path('categories/',CategoriesListAPIView.as_view(),
         name='categories-list'),

]
