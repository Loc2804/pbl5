from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from .role import Role


# Quản lý User
class UserManager(BaseUserManager):
    def create_user(self, username, password=None, **extra_fields):
        if not username:
            raise ValueError("The Username field must be set")

        user = self.model(username=username, **extra_fields)
        user.set_password(password)  # Hash mật khẩu trước khi lưu
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(username, password, **extra_fields)


# Model User kế thừa AbstractBaseUser để có check_password()
class User(AbstractBaseUser):
    username = models.CharField(max_length=150, unique=True)
    full_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)

    # Khóa ngoại đến Role (N-1)
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True, related_name='users')


    objects = UserManager()

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = []  # Có thể thêm 'email' nếu cần

    def __str__(self):
        return self.username
