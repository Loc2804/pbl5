# models/category.py
from django.db import models

class Category(models.Model):
    category_value = models.CharField(max_length=255)

    def __str__(self):
        return self.category_value
