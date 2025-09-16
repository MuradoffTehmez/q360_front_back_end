# ideas/urls.py
from rest_framework.routers import DefaultRouter
from django.urls import path, include
from . import views

router = DefaultRouter()
router.register(r'categories', views.IdeaCategoryViewSet)
router.register(r'ideas', views.IdeaViewSet)
router.register(r'likes', views.IdeaLikeViewSet)
router.register(r'comments', views.IdeaCommentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]