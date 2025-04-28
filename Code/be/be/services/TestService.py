# services/test_service.py
from ..models import Test
from django.contrib.auth import get_user_model
from be.serializers.TestSerializer import TestSerializer
# services/study_progress_service.py
from be.models.study_progress import StudyProgress
from be.models.vocabulary import Vocabulary
User = get_user_model()

class TestService:
    @staticmethod
    def create_test(data):
        serializer = TestSerializer(data=data)
        if serializer.is_valid():
            test = serializer.save()
            return test

    @staticmethod
    def update_user_study_progress(user, vocab_id):
        if not vocab_id:
            raise ValueError('Missing vocab_id')

        try:
            vocabulary = Vocabulary.objects.get(id=vocab_id)
        except Vocabulary.DoesNotExist:
            raise ValueError('Vocabulary not found')

        # Lấy hoặc tạo study progress
        progress, created = StudyProgress.objects.get_or_create(user=user)

        # Nếu từ này đã học rồi thì không cần thêm nữa
        if not progress.list_word.filter(id=vocab_id).exists():
            progress.list_word.add(vocabulary)

        # Cập nhật phần trăm
        total_vocabs = Vocabulary.objects.count()
        learned_count = progress.list_word.count()

        if total_vocabs > 0:
            progress.study_percent = (learned_count / total_vocabs) * 100
        else:
            progress.study_percent = 0.0

        progress.save()

        return progress.study_percent

    @staticmethod
    def get_learned_word_ids(user):
        try:
            progress = user.study_progress
            word_ids = progress.list_word.values_list('id', flat=True)
            return list(word_ids)
        except (User.DoesNotExist, StudyProgress.DoesNotExist):
            return []

    @staticmethod
    def get_tests_by_user_id(user):
        tests = Test.objects.filter(user=user)
        serializer = TestSerializer(tests, many=True)
        return serializer.data


