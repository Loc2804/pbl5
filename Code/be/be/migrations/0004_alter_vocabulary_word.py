# Generated by Django 5.1.7 on 2025-04-02 14:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('be', '0003_remove_user_is_active_remove_user_is_staff'),
    ]

    operations = [
        migrations.AlterField(
            model_name='vocabulary',
            name='word',
            field=models.CharField(max_length=255, unique=True),
        ),
    ]
