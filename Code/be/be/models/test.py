# models/test.py
from django.db import models
from .user import User
from django.contrib.auth import get_user_model

class Test(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tests')
    score = models.FloatField()

    def __str__(self):
        return f"Test by {self.user.username} - Score: {self.score}"


