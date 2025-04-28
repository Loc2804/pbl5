import traceback

from rest_framework import views, status
from rest_framework.response import Response

from be.serializers.UserResponseSerializer import UserResponseSerializer
from be.services.VocabularyService import VocabularyService
from be.serializers.VocabularySerializer import VocabularySerializer
from be.serializers.VocabularyResponseSerializer import VocabularyResponseSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from pydub import AudioSegment
import os
import tempfile
class VocabularyListCreateView(views.APIView):
    def get(self, request):
        vocabulary = VocabularyService.get_all_vocabularies()
        serializer = VocabularyResponseSerializer(vocabulary, many=True)
        if vocabulary.exists():
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

    def post(self, request):
        data, errors = VocabularyService.create_vocabulary(request.data)
        if errors:
            return Response(errors, status=200)
        return Response(data, status=200)


class VocabularyDetailView(views.APIView):
    def get(self, request, vocab_id):
        vocab = VocabularyService.get_vocabulary_by_id(vocab_id)
        if not vocab:
            return Response({"errCode": 2, "message": "Vocabulary not found"}, status=200)
        serializer = VocabularySerializer(vocab)
        return Response({"errCode": 0, "message": "Success", "data": serializer.data}, status=200)

    def put(self, request, voc_id):
        response = VocabularyService.update_vocabulary(voc_id, request.data)
        if response["errCode"] == 0:
            return Response(response, status=status.HTTP_200_OK)
        return Response(response, status=status.HTTP_200_OK)  # Changed to 200 OK

    def delete(self, request, voc_id):
        success, errors = VocabularyService.delete_vocabulary(voc_id)
        if errors:
            return Response(errors, status=200)
        return Response(success, status=200)


class PronunciationCheckView(views.APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        try:
            audio_file = request.FILES.get('audio')
            expected_text = request.data.get('text')

            if not audio_file or not expected_text:
                return Response({
                    "errCode": 1,
                    "message": "Thiếu file audio hoặc văn bản chuẩn"
                }, status=400)

            # Kiểm tra định dạng file
            if not audio_file.name.lower().endswith('.wav'):
                return Response({
                    "errCode": 2,
                    "message": "Chỉ chấp nhận file WAV"
                }, status=400)

            # Lưu file WAV gốc (không cần convert)
            with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_audio:
                for chunk in audio_file.chunks():
                    temp_audio.write(chunk)
                temp_audio_path = temp_audio.name

            # os.system(f"start {temp_audio_path}")
            # Gọi xử lý phát âm trực tiếp với file WAV
            result = VocabularyService.check_pronunciation_from_text(
                user_audio_path=temp_audio_path,
                expected_text=expected_text
            )

            # Dọn file tạm
            os.remove(temp_audio_path)

            return Response(result, status=200)

        except Exception as e:
            traceback.print_exc()
            return Response({
                "errCode": 3,
                "message": f"Lỗi hệ thống: {str(e)}"
            }, status=500)
