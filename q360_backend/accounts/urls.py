# accounts/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('me/', views.me_view, name='me'),
    path('password-reset/request/', views.password_reset_request_view, name='password-reset-request'),
    path('password-reset/confirm/', views.password_reset_confirm_view, name='password-reset-confirm'),
    path('verify-email/', views.verify_email_view, name='verify-email'),
    path('users/', views.UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/', views.UserDetailView.as_view(), name='user-detail'),
]