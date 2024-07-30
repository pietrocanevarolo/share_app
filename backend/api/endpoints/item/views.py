from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from api.serializers import ItemSerializer
from api.models import Item
from django.utils import timezone


class ItemListAPIView(generics.ListCreateAPIView):
    serializer_class = ItemSerializer

    def post(self, request, format=None):

        serializer = ItemSerializer(data=request.data)
        if serializer.is_valid():
            driver_object = Item.objects.filter(name=serializer.validated_data['name'],
                                                  surname=serializer.validated_data['surname'])
            if not driver_object:
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(driver_object.values()[0], status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):
        queryset = Item.objects.all()

        return queryset
