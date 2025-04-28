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
import os
from django.urls import path
from be.controllers.UserController import UserListView, UserDetailView, LoginView, AccountView, ForgotPasswordView
from be.controllers.VocabularyController import VocabularyListCreateView, VocabularyDetailView, PronunciationCheckView
from be.controllers.CategoryController import CategoryListView
from be.controllers.TestController import SubmitTestView, UpdateStudyProgressView, UserTestHistoryView
from be.controllers.PredictionController import PredictView
from django.conf import settings
from django.conf.urls.static import static

from be.settings import BASE_DIR

urlpatterns = [
    path('api/login/', LoginView.as_view(), name='user-login'),
    path('api/account/', AccountView.as_view(), name='user-account'),  # PUT & POST
    path('api/forgot-password/', ForgotPasswordView.as_view(), name='user-forgot-password'), # put
    path('api/users/', UserListView.as_view(), name='user-list'),          # GET & POST
    path('api/users/<int:user_id>/', UserDetailView.as_view(), name='user-detail'),  # GET, PUT & DELETE
    path('api/vocs/', VocabularyListCreateView.as_view(), name='voc-list'),          # GET & POST
    path('api/vocs/<int:voc_id>/', VocabularyDetailView.as_view(), name='voc-detail'),  # GET, PUT & DELETE
    path('api/categories/', CategoryListView.as_view(), name='category-list'),
    path('api/speaking/', PronunciationCheckView.as_view(), name='check_pronunciation'),
    path('api/test_result/', SubmitTestView.as_view(), name='submit-test'),
    path('api/update_progress/', UpdateStudyProgressView.as_view(), name='update-progress'),
    path('api/learned_voc/<int:user_id>/', UpdateStudyProgressView.as_view(), name='get-list-learned-voc'),
    path('api/predict/', PredictView.as_view(), name='predict'),
    path('api/history/<int:user_id>/', UserTestHistoryView.as_view(), name='user-test-history'),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
