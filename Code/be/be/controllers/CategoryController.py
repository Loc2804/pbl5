from rest_framework import views
from rest_framework.response import Response
from be.services.CategoryService import CategoryService
from be.serializers.CategorySerializer import CategorySerializer

class CategoryListView(views.APIView):
    def get(self, request):
        categories = CategoryService.get_all_categories()
        serializer = CategorySerializer(categories, many=True)
        if categories.exists():
            return Response({
                "errCode": 0,
                "message": "Success",
                "data": serializer.data
            }, status=200)
        else:
            return Response({
                "errCode": 0,
                "message": "No categories found",
                "data": []
            }, status=200)
