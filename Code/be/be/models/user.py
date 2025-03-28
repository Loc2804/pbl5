# models/user.py
from django.db import models
from .role import Role

class User(models.Model):
    username = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=128)
    full_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)

    # Khóa ngoại đến Role (N-1)
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True, related_name='users')

    def __str__(self):
        return self.username
