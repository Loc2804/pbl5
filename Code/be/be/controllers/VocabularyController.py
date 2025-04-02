from rest_framework import status, views
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from be.serializers.UserResponseSerializer import UserResponseSerializer
from be.services.VocabularyService import VocabularyService
from be.serializers.VocabularySerializer import VocabularySerializer
from rest_framework import status

class VocabularyListCreateView(views.APIView):
    def get(self, request):
        vocabularies = VocabularyService.get_all_vocabularies()
        serializer = VocabularySerializer(vocabularies, many=True)
        return Response({"errCode": 0, "message": "Success", "data": serializer.data})

    def post(self, request):
        data, errors = VocabularyService.create_vocabulary(request.data)
        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(data, status=status.HTTP_201_CREATED)


class VocabularyDetailView(views.APIView):
    def get(self, request, vocab_id):
        vocab = VocabularyService.get_vocabulary_by_id(vocab_id)
        if not vocab:
            return Response({"errCode": 2, "message": "Vocabulary not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = VocabularySerializer(vocab)
        return Response({"errCode": 0, "message": "Success", "data": serializer.data})

    def put(self, request, vocab_id):
        data, errors = VocabularyService.update_vocabulary(vocab_id, request.data)
        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(data)

    def delete(self, request, vocab_id):
        success, errors = VocabularyService.delete_vocabulary(vocab_id)
        if errors:
            return Response(errors, status=status.HTTP_404_NOT_FOUND)
        return Response(success, status=status.HTTP_204_NO_CONTENT)