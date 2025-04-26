from be.models import Category
from be.models.vocabulary import Vocabulary
from be.serializers.VocabularyResponseSerializer import VocabularyResponseSerializer
from be.serializers.VocabularySerializer import VocabularySerializer
import librosa
import numpy as np
import speech_recognition as sr
from difflib import SequenceMatcher

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

    @staticmethod
    def check_pronunciation_from_text(user_audio_path, expected_text):
        recognized_text = VocabularyService._transcribe_audio(user_audio_path)

        if recognized_text in ["Không nhận diện được giọng nói", "Lỗi kết nối đến API nhận diện giọng nói"]:
            return {"errCode": 1, "message": recognized_text}

        errors = VocabularyService._compare_words(expected_text, recognized_text)

        if not errors:
            return {"errCode": 0, "message": "Người dùng đã phát âm đúng"}
        else:
            wrong_words = ', '.join(sum(errors, []))
            return {"errCode": 1, "message": f"Người dùng phát âm sai các từ: {wrong_words}"}


    @staticmethod
    def _transcribe_audio(user_audio_path):
        recognizer = sr.Recognizer()
        try:
            # Kiểm tra nếu file audio không tồn tại hoặc không hợp lệ
            with sr.AudioFile(user_audio_path) as source:
                audio = recognizer.record(source)  # Đọc toàn bộ file audio
                recognized_text = recognizer.recognize_google(audio, language='en-EN')  # Nhận diện giọng nói
                return recognized_text

        except FileNotFoundError:
            print(f"Lỗi: Không tìm thấy file {user_audio_path}")
            return "File không tồn tại"

        except sr.UnknownValueError:
            # Lỗi khi Google không thể nhận diện âm thanh
            print("Lỗi nhận diện giọng nói: Không thể hiểu nội dung")
            return "Không nhận diện được giọng nói"

        except sr.RequestError as e:
            # Lỗi khi không thể kết nối tới Google API
            print(f"Lỗi kết nối API Google: {str(e)}")
            return "Lỗi kết nối đến API nhận diện giọng nói"

        except Exception as e:
            # Lỗi bất kỳ khác
            print(f"Lỗi transcribe: {str(e)}")  # Log lỗi chi tiết
            return f"Lỗi nhận diện giọng nói: {str(e)}"

    @staticmethod
    def _compare_words(reference, user_speech):
        ref_words = reference.lower().split()
        user_words = user_speech.lower().split()

        word_mapping = SequenceMatcher(None, ref_words, user_words).get_opcodes()
        errors = []

        for tag, i1, i2, j1, j2 in word_mapping:
            if tag != "equal":
                errors.append(ref_words[i1:i2])
        return errors
