from rest_framework import status, views
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from be.models import Role
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
            return Response(response, status=status.HTTP_200_OK)
        return Response({"errCode": 1, "message": "Validation failed"}, status=status.HTTP_200_OK)

class UserDetailView(views.APIView):
    # Lấy thông tin người dùng theo ID
    def get(self, request, user_id):
        response = get_user_by_id(user_id)
        if response["errCode"] == 0:
            return Response(response, status=status.HTTP_200_OK)
        return Response(response, status=status.HTTP_200_OK)  # Changed to 200 OK

    # Cập nhật thông tin người dùng
    def put(self, request, user_id):
            response = update_user(user_id, request.data)
            if response["errCode"] == 0:
                return Response(response, status=status.HTTP_200_OK)
            return Response(response, status=status.HTTP_200_OK)  # Changed to 200 OK


    # Xóa người dùng
    def delete(self, request, user_id):
        response = delete_user(user_id)
        if response["errCode"] == 0:
            return Response({"errCode": response["errCode"], "message": response["message"]}, status=status.HTTP_200_OK)
        return Response({"errCode": response["errCode"], "message": response["message"]}, status=status.HTTP_200_OK)  # Changed to 200 OK

class LoginView(views.APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response({
                "errCode": 1,
                "error": "Username and password are required."
            }, status=status.HTTP_200_OK)

        # Xác thực người dùng
        user_data = login_user(username, password)
        if user_data.get("errCode") == 0:
            return Response({
                "errCode": 0,
                "data": UserResponseSerializer(user_data).data
            }, status=status.HTTP_200_OK)

        return Response(user_data, status=status.HTTP_200_OK)  # Changed to 200 OK

class AccountView(views.APIView):
    def post(self, request):
        data = request.data.copy()  # Tạo bản sao để tránh sửa trực tiếp `request.data`
        try:
            role = Role.objects.get(id=2)
        except Role.DoesNotExist:
            return Response({"error": "Role not found."}, status=status.HTTP_400_BAD_REQUEST)

        data['role'] = role  # Gán instance Role thay vì số nguyên
        username = data.get("username")
        password = data.get("password")
        full_name = data.get("full_name")

        if not all([username, password, full_name]):
            return Response({"error": "Username, password, and full_name are required."}, status=status.HTTP_200_OK)  # Changed to 200 OK

        user = create_user(data)
        if not user:
            return Response({"user":user}, status=status.HTTP_200_OK)  # Changed to 200 OK

        return Response({"user":user}, status=status.HTTP_200_OK)

    def put(self, request):
        data = request.data
        response = update_user_info(data)
        if response["errCode"] == 0:
            return Response({"Message": response["message"], "data" : response["data"]}, status=status.HTTP_200_OK)

        return Response({"Error": response["error"]}, status=status.HTTP_200_OK)  # Changed to 200 OK


class ForgotPasswordView(views.APIView):
    # Quên mật khẩu
    def put(self, request):
        username = request.data.get("username")
        phone = request.data.get("phone")
        if not username or not phone:
            return Response({"error": "Username and phone are required."}, status=status.HTTP_200_OK)  # Changed to 200 OK

        response = set_default_password(username, phone)
        if response['errCode'] == 0:
            return Response({"response": response}, status=status.HTTP_200_OK)

        return Response({"response": response}, status=status.HTTP_200_OK)  # Changed to 200 OK