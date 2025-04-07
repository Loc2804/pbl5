from be.models import Category
from be.models.vocabulary import Vocabulary
from be.serializers.VocabularyResponseSerializer import VocabularyResponseSerializer
from be.serializers.VocabularySerializer import VocabularySerializer

class VocabularyService:
    @staticmethod
    def format_vocabulary(vocab):
        return {
            "id": vocab.id,
            "word": vocab.word,
            "meaning": vocab.meaning,
            "pronunciation": vocab.pronunciation,
            "image_path": vocab.image_path,
            "audio_path": vocab.audio_path,
            "example": vocab.example,
            "category": {
                "id": vocab.category.id,
                "category_value": vocab.category.category_value,
            } if vocab.category else None,
        }

    @staticmethod
    def get_all_vocabularies():
        return Vocabulary.objects.all()
            # vocabularies = Vocabulary.objects.select_related('category').all()
            # vocab_list = []
            #
            # for vocab in vocabularies:
            #     vocab_list.append({
            #         "id": vocab.id,
            #         "word": vocab.word,
            #         "meaning": vocab.meaning,
            #         "pronunciation": vocab.pronunciation,
            #         "image_path": vocab.image_path,
            #         "audio_path": vocab.audio_path,
            #         "example": vocab.example,
            #         "category": {
            #             "id": vocab.category.id if vocab.category else None,
            #             "category_value": vocab.category.category_value if vocab.category else None,
            #         }
            #     })

            # return {"errCode": 0, "message": "Success", "data": vocab_list}

    @staticmethod
    def get_vocabulary_by_id(vocab_id):
        vocab = Vocabulary.objects.select_related('category').filter(id=vocab_id).first()
        if not vocab:
            return {"errCode": 1, "message": "Vocabulary not found"}
        return {"errCode": 0, "message": "Success", "data": VocabularyService.format_vocabulary(vocab)}

    @staticmethod
    def create_vocabulary(data):
        serializer = VocabularySerializer(data=data)
        if serializer.is_valid():
            vocab = serializer.save()
            return {
                "errCode": 0,
                "message": "Vocabulary created successfully",
                "data": VocabularyService.format_vocabulary(vocab)
            }, None
        return None, {"errCode": 1, "message": "Validation failed", "errors": serializer.errors}

    @staticmethod
    def update_vocabulary(vocab_id, data):
        vocab = Vocabulary.objects.filter(id=vocab_id).first()
        if not vocab:
            return {"errCode": 2, "message": "Vocabulary not found"}

        # Cập nhật các trường
        for key, value in data.items():
            if key == 'category':  # Xử lý riêng cho khóa ngoại category
                try:
                    category = Category.objects.get(id=value)
                    setattr(vocab, key, category)
                except Category.DoesNotExist:
                    return {"errCode": 3, "message": "Category not found"}
            elif key in ['word', 'pronunciation', 'meaning', 'image_path', 'audio_path', 'example']:
                setattr(vocab, key, value)

        # Lưu lại thay đổi
        vocab.save()

        # Serialize kết quả trả về
        vocab_data = VocabularyResponseSerializer(vocab).data
        return {"errCode": 0, "message": "Vocabulary updated successfully", "data": vocab_data}

    @staticmethod
    def delete_vocabulary(vocab_id):
        vocab = Vocabulary.objects.filter(id=vocab_id).first()
        if vocab:
            vocab.delete()
            return {"errCode": 0, "message": "Vocabulary deleted successfully"}, None
        return None, {"errCode": 2, "message": "Vocabulary not found"}