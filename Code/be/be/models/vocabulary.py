# models/vocabulary.py
from django.db import models
from .category import Category

class Vocabulary(models.Model):
    word = models.CharField(max_length=255)
    pronunciation = models.CharField(max_length=255, blank=True, null=True)
    meaning = models.TextField()
    image = models.ImageField(upload_to='vocabulary_images/', blank=True, null=True)
    audio = models.FileField(upload_to='vocabulary_audios/', blank=True, null=True)
    example = models.TextField(blank=True, null=True)

    # Khóa ngoại đến Category (N-1)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='vocabularies')

    def __str__(self):
        return self.word
