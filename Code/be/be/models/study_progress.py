# models/study_progress.py
from django.db import models
from .user import User
from .vocabulary import Vocabulary

class StudyProgress(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='study_progress')
    list_word = models.ManyToManyField(Vocabulary, related_name='study_progresses')
    study_percent = models.FloatField(default=0.0)
    last_reviewed = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Progress of {self.user.username}"
