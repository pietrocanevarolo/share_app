from .models import Item,CustomUser
from django.contrib.auth import authenticate
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import CustomUserSerializer

class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        print(username, password)
        user = authenticate(username=username, password=password)
        if user is not None:
            return Response({'message': 'Login successful', 'user': CustomUserSerializer(user).data})
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        