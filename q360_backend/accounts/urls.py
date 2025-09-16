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
    path('mfa/setup/', views.mfa_setup_view, name='mfa-setup'),
    path('mfa/enable/', views.mfa_enable_view, name='mfa-enable'),
    path('mfa/disable/', views.mfa_disable_view, name='mfa-disable'),
    path('mfa/verify/', views.mfa_verify_view, name='mfa-verify'),
    path('users/', views.UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/', views.UserDetailView.as_view(), name='user-detail'),
]