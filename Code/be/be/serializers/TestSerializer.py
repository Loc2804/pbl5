# serializers/test_serializer.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from be.models.test import Test

User = get_user_model()

class TestSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Test
        fields = ['user_id', 'score']
