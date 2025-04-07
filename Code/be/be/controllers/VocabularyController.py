from rest_framework import views, status
from rest_framework.response import Response

from be.serializers.UserResponseSerializer import UserResponseSerializer
from be.services.VocabularyService import VocabularyService
from be.serializers.VocabularySerializer import VocabularySerializer
from be.serializers.VocabularyResponseSerializer import VocabularyResponseSerializer

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
