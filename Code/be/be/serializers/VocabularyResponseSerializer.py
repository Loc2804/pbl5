from rest_framework import serializers
from be.models.category import Category
from be.serializers.CategorySerializer import CategorySerializer

class VocabularyResponseSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    word = serializers.CharField()
    pronunciation = serializers.CharField()
    meaning = serializers.CharField()
    image_path = serializers.CharField()
    audio_path = serializers.CharField()
    example = serializers.CharField()
    # Khóa ngoại đến Category (N-1)
    category = CategorySerializer()
