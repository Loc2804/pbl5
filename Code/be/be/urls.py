"""
URL configuration for be project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# from django.contrib import admin
from django.urls import path

from django.urls import path
from be.controllers.UserController import UserListView, UserDetailView, LoginView, AccountView, ForgotPasswordView

urlpatterns = [
    path('api/login/', LoginView.as_view(), name='user-login'),
    path('api/account/', AccountView.as_view(), name='user-account'),  # PUT & POST
    path('api/forgot-password/', ForgotPasswordView.as_view(), name='user-forgot-password'), # put
    path('api/users/', UserListView.as_view(), name='user-list'),          # GET & POST
    path('api/users/<int:user_id>/', UserDetailView.as_view(), name='user-detail'),  # GET, PUT & DELETE
]
