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

        category_id = self.request.query_params.get('category_id')
        if category_id:
            return  queryset.filter(parent=category_id)

        return queryset
