# views/predict_controller.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from be.services.PredictionService import PredictionService
from rest_framework.parsers import MultiPartParser, FormParser
class PredictView(APIView):
    parser_classes = [MultiPartParser, FormParser]  # Hỗ trợ multipart form data

    def post(self, request):
        file = request.FILES.get('file')

        if not file:
            return Response({
                'errCode': 1,
                'message': 'Missing file'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            file_bytes = file.read()
            result = PredictionService.predict(file_bytes)

            return Response({
                'errCode': 0,
                'message': 'Prediction successful',
                'data': result
            }, status=status.HTTP_200_OK)

        except ValueError as e:
            return Response({
                'errCode': 1,
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({
                'errCode': 2,
                'message': f'Unexpected error: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
