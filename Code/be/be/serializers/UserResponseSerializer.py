from rest_framework import serializers
from be.models.role import Role

class UserResponseSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    username = serializers.CharField()
    fullname = serializers.CharField()
    phone = serializers.CharField(allow_null=True, allow_blank=True)
    address = serializers.CharField(allow_null=True, allow_blank=True)
    role = serializers.PrimaryKeyRelatedField(queryset=Role.objects.all(), allow_null=True)
