# notifications/urls.py
from rest_framework.routers import DefaultRouter
from django.urls import path, include
from . import views

router = DefaultRouter()
router.register(r'notifications', views.NotificationViewSet)
router.register(r'preferences', views.NotificationPreferenceViewSet)

urlpatterns = [
    path('', include(router.urls)),
]