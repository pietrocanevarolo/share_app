from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from api.serializers import ItemSerializer
from api.models import Item,Category
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
        category_id = self.request.query_params.get('category_id')
        sub_category_id = self.request.query_params.get('sub_category_id')

        print(category_id)
        print(sub_category_id)
        if sub_category_id:
            return  queryset.filter(category=sub_category_id)
        
        elif category_id and not sub_category_id:
            sub_categories=Category.objects.filter(parent=category_id)
            sub_category_ids = sub_categories.values_list('id', flat=True)

            return  queryset.filter(category__in=sub_category_ids)

        return queryset
