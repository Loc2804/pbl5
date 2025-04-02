from be.models.vocabulary import Vocabulary
from be.serializers.VocabularySerializer import VocabularySerializer
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError, ObjectDoesNotExist

class VocabularyService:
    @staticmethod
    def get_all_vocabularies():
        return Vocabulary.objects.all()

    @staticmethod
    def get_vocabulary_by_id(vocab_id):
        return Vocabulary.objects.filter(id=vocab_id).first()

    @staticmethod
    def create_vocabulary(data):
        serializer = VocabularySerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return {"errCode": 0, "message": "Vocabulary created successfully", "data": serializer.data}, None
        return None, {"errCode": 1, "message": "Validation failed", "errors": serializer.errors}

    @staticmethod
    def update_vocabulary(vocab_id, data):
        vocab = VocabularyService.get_vocabulary_by_id(vocab_id)
        if vocab:
            serializer = VocabularySerializer(vocab, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return {"errCode": 0, "message": "Vocabulary updated successfully", "data": serializer.data}, None
            return None, {"errCode": 1, "message": "Validation failed", "errors": serializer.errors}
        return None, {"errCode": 2, "message": "Vocabulary not found"}

    @staticmethod
    def delete_vocabulary(vocab_id):
        vocab = VocabularyService.get_vocabulary_by_id(vocab_id)
        if vocab:
            vocab.delete()
            return {"errCode": 0, "message": "Vocabulary deleted successfully"}, None
        return None, {"errCode": 2, "message": "Vocabulary not found"}
