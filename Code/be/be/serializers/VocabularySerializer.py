from rest_framework import serializers
from be.models.vocabulary import Vocabulary

class VocabularySerializer(serializers.ModelSerializer):
    class Meta:
        model = Vocabulary
        fields = '__all__'