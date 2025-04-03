# models/vocabulary.py
from django.db import models
from .category import Category

class Vocabulary(models.Model):
    word = models.CharField(max_length=255, unique=True)
    pronunciation = models.CharField(max_length=255, blank=True, null=True)
    meaning = models.TextField()
    image_path = models.CharField(max_length=512, blank=True, null=True)  # Lưu đường dẫn ảnh dưới dạng string
    audio_path = models.CharField(max_length=512, blank=True, null=True)  # Lưu đường dẫn audio dưới dạng string
    example = models.TextField(blank=True, null=True)

    # Khóa ngoại đến Category (N-1)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='vocabularies')

    def __str__(self):
        return self.word
