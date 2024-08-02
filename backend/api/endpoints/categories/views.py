from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from api.serializers import CategorySerializer
from api.models import Category
from django.utils import timezone


class CategoriesListAPIView(generics.ListCreateAPIView):
    serializer_class = CategorySerializer

    def get_queryset(self):
        queryset = Category.objects.all()

        return queryset
