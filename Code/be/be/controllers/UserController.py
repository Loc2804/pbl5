from rest_framework import status, views
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from be.serializers.UserResponseSerializer import UserResponseSerializer
from be.services.UserService import (
    get_all_users, get_user_by_id, create_user,
    update_user, delete_user, login_user, set_default_password, update_user_info
)
from be.serializers.UserSerializer import UserSerializer
from rest_framework import status

class UserListView(views.APIView):
    # Lấy danh sách tất cả người dùng
    def get(self, request):
        response = get_all_users()
        return Response(response, status=status.HTTP_200_OK)

    # Tạo mới người dùng
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            response = create_user(serializer.validated_data)
            if response["errCode"] == 0:
                return Response(response, status=status.HTTP_201_CREATED)
            return Response(response, status=status.HTTP_400_BAD_REQUEST)
        return Response({"errCode": 1, "message": "Validation failed", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class UserDetailView(views.APIView):
    # Lấy thông tin người dùng theo ID
    def get(self, request, user_id):
        response = get_user_by_id(user_id)
        if response["errCode"] == 0:
            return Response(response, status=status.HTTP_200_OK)
        return Response(response, status=status.HTTP_404_NOT_FOUND)

    # Cập nhật thông tin người dùng
    def put(self, request, user_id):
        serializer = UserSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            response = update_user(user_id, serializer.validated_data)
            if response["errCode"] == 0:
                return Response(response, status=status.HTTP_200_OK)
            return Response(response, status=status.HTTP_400_BAD_REQUEST)
        return Response({"errCode": 1, "message": "Validation failed", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    # Xóa người dùng
    def delete(self, request, user_id):
        response = delete_user(user_id)
        if response["errCode"] == 0:
            return Response(response, status=status.HTTP_204_NO_CONTENT)
        return Response(response, status=status.HTTP_404_NOT_FOUND)

class LoginView(views.APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response({"error": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Xác thực người dùng thay vì kiểm tra dữ liệu đầu vào bằng serializer
        user_data = login_user(username, password)
        print(user_data)
        if user_data:
            return Response(UserResponseSerializer(user_data).data, status=status.HTTP_200_OK)

        return Response({"error": "Invalid username or password."}, status=status.HTTP_401_UNAUTHORIZED)

class AccountView(views.APIView):
    def post(self, request):
        data = request.data
        data['role'] = 2
        username = data.get("username")
        password = data.get("password")
        full_name = data.get("full_name")

        if not all([username, password, full_name]):
            return Response({"error": "Username, password, and full_name are required."},
                            status=status.HTTP_400_BAD_REQUEST)

        user = create_user(data)
        if not user:
            return Response({"error": "Register failed."}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"Message": "Register Successful."}, status=status.HTTP_200_OK)

    def put(self, request):
        data = request.data
        response = update_user_info(data)
        if response["errCode"] == 0:
            return Response({"Message": response["message"], "data" : response["data"]}, status=status.HTTP_200_OK)

        return Response({"Error": response["error"]}, status=status.HTTP_400_BAD_REQUEST)


class ForgotPasswordView(views.APIView):
    # Quên mật khẩu
    def put(self, request):
        username = request.data.get("username")
        phone = request.data.get("phone")
        if not username or not phone:
            return Response({"error": "Username and phone are required."}, status=status.HTTP_400_BAD_REQUEST)

        response = set_default_password(username, phone)
        if response['errCode'] == 0:
            return Response({"message": response['message']}, status=status.HTTP_200_OK)

        return Response({"error": response['error']}, status=status.HTTP_400_BAD_REQUEST)

