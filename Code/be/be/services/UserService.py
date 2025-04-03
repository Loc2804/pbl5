from be.models.user import User
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from django.contrib.auth.hashers import make_password


# Kiểm tra username đã tồn tại hay chưa
def username_exists(username):
    return User.objects.filter(username=username).exists()


# Lấy tất cả người dùng
def get_all_users():
    users = User.objects.all()
    return {"errCode": 0, "message": "Success", "data": list(users.values())}


# Lấy người dùng theo ID
def get_user_by_id(user_id):
    user = User.objects.filter(id=user_id).first()
    if not user:
        return {"errCode": 1, "message": "User not found"}
    return {"errCode": 0, "message": "Success", "data": user}


# Tạo mới người dùng
def create_user(data):
    if "username" in data and username_exists(data["username"]):
        return {"errCode": 1, "message": "Username already exists"}

    if "password" in data:
        data["password"] = make_password(data["password"])  # Hash mật khẩu

    user = User.objects.create(**data)
    return {"errCode": 0, "message": "User created successfully", "data": user}


# Cập nhật người dùng
def update_user(user_id, data):
    user = User.objects.filter(id=user_id).first()
    if not user:
        return {"errCode": 1, "message": "User not found"}

    if "username" in data and username_exists(data["username"]) and user.username != data["username"]:
        return {"errCode": 2, "message": "Username already exists"}

    if "password" in data:
        data["password"] = make_password(data["password"])  # Hash mật khẩu mới

    for key, value in data.items():
        setattr(user, key, value)  # Gán giá trị mới
    user.save()
    return {"errCode": 0, "message": "User updated successfully", "data": user}


# Xóa người dùng
def delete_user(user_id):
    user = User.objects.filter(id=user_id).first()
    if not user:
        return {"errCode": 1, "message": "User not found"}

    user.delete()
    return {"errCode": 0, "message": "User deleted successfully"}


from django.contrib.auth import authenticate


# Đăng nhập và trả về thông tin người dùng
def login_user(username, password):
    user = User.objects.filter(username=username).first()
    if not user:
        raise ValidationError("Invalid username or password.")

    if not user.check_password(password):  # Kiểm tra mật khẩu đã hash
        raise ValidationError("Invalid username or password.")

    return {
        "id": user.id,
        "username": user.username,
        "fullname": user.full_name,
        "phone": user.phone,
        "address": user.address,
        "role": user.role
    }

def set_default_password(username, phone):
    user = User.objects.filter(username=username)
    if not user:  # Kiểm tra user có tồn tại không
        return {
            "errCode": 1,
            "error": "User does not exist."
        }

    if user.phone != phone:  # Kiểm tra số điện thoại
        return {
            "errCode": 2,
            "error": "Invalid phone number."
        }

    user.password = make_password("1")  # Đặt lại mật khẩu thành "1"
    user.save()
    return {
        "errCode": 0,
        "message": "Password is set default to '1'.",
    }

def update_user_info(data):
    user = User.objects.filter(username=data["username"]).first()
    if not user:  # Kiểm tra user có tồn tại không
        return {
            "errCode": 1,
            "error": "User does not exist."
        }
    user["phone"] = data["phone"]
    user["address"] = data["address"]
    user["full_name"] = data["full_name"]
    user.save()
    return {
        "errCode": 0,
        "Message": "Update user info success.",
        "data":user,
    }