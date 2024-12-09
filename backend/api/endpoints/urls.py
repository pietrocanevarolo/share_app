from django.urls import path
from django.urls import include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path('', include('api.endpoints.item.urls')),
    path('', include('api.endpoints.categories.urls')),
    path('', include('api.endpoints.chat.urls')),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    ]
