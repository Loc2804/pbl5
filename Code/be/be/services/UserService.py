from be.models.user import User
from be.models.role import Role
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from django.contrib.auth.hashers import make_password

from be.serializers.UserResponseSerializer import UserResponseSerializer


# Kiểm tra username đã tồn tại hay chưa
def username_exists(username):
    return User.objects.filter(username=username).exists()


def get_all_users():
    users = User.objects.select_related('role').all()
    user_list = []
    for user in users:
        user_list.append({
            "id": user.id,
            "username": user.username,
            "full_name": user.full_name,
            "phone": user.phone,
            "address": user.address,
            "role": {
                "role_id": user.role.id if user.role else None,
                "role_value": user.role.role_value if user.role else None,
                # Thêm các trường khác của role nếu cần
            }
        })
    return {"errCode": 0, "message": "Success", "data": user_list}


# Lấy người dùng theo ID
def get_user_by_id(user_id):
    user = User.objects.filter(id=user_id).first()
    if not user:
        return {"errCode": 1, "message": "User not found"}
    return {"errCode": 0, "message": "Success", "data": user}


def create_user(data):
    if "username" not in data:
        return {"errCode": 1, "message": "Username is required"}

    if username_exists(data["username"]):
        return {"errCode": 1, "message": "Username already exists"}

    if "password" not in data:
        return {"errCode": 1, "message": "Password is required"}

    data["password"] = make_password(data["password"])  # Hash mật khẩu

    user = User.objects.create(**data)
    return {"errCode": 0, "message": "User created successfully"}



def update_user(user_id, data):
    # Tìm user bằng id
    user = User.objects.filter(id=user_id).first()
    if not user:
        return {"errCode": 1, "message": "User not found"}

    # Chỉ cập nhật những trường cần thiết
    for key, value in data.items():
        if key == 'role':  # Kiểm tra trường 'role'
            try:
                role = Role.objects.get(id=value)  # Lấy Role với id là value
                setattr(user, key, role)  # Gán đối tượng Role vào trường role
            except Role.DoesNotExist:
                return {"errCode": 2, "message": "Role not found"}
        elif key in ['full_name', 'phone', 'address']:  # Các trường khác
            setattr(user, key, value)  # Gán giá trị mới cho trường
    user.save()  # Lưu lại thay đổi

    user_data = UserResponseSerializer(user).data  # serialize đối tượng user
    return {"errCode": 0, "message": "User updated successfully", "data": user_data}

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
        return {"errCode":1,"error":"Invalid username or password."}

    if not user.check_password(password):  # Kiểm tra mật khẩu đã hash
        return {"errCode":1,"error":"Wrong password!"}

    return {
        "errCode": 0,
        "id": user.id,
        "username": user.username,
        "full_name": user.full_name,
        "phone": user.phone,
        "address": user.address,
        "role": user.role
    }

def set_default_password(username, phone):
    user = User.objects.filter(username=username).first()
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