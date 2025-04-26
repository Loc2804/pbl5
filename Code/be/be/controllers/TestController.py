# views/test_controller.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from be.services.TestService import TestService
from be.models.user import User
class SubmitTestView(APIView):
    def post(self, request):
        data = TestService.create_test(request.data)
        return Response(status=200)

class UpdateStudyProgressView(APIView):
    def post(self,request):
        vocab_id = request.data.get('vocab_id')
        user_id = request.data.get('user_id')

        if not vocab_id or not user_id:
            return Response({
                'errCode': 1,
                'message': 'Missing vocab_id or user_id'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({
                'errCode': 1,
                'message': 'User not found'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            study_percent = TestService.update_user_study_progress(user, vocab_id)
            return Response({
                'errCode': 0,
                'message': 'Progress updated successfully',
                'study_percent': study_percent,
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

    def get(self, request,user_id):
        user_id = user_id  # lấy user_id từ query string, ví dụ: /api/learned_word_ids/?user_id=5
        user = User.objects.get(id=user_id)
        if not user_id:
            return Response({"error": "Missing user_id"}, status=status.HTTP_400_BAD_REQUEST)

        learned_word_ids = TestService.get_learned_word_ids(user)
        return Response({
            "errCode": 0,
            "data": learned_word_ids
        }, status=status.HTTP_200_OK)