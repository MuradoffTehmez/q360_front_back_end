# evaluations/urls.py
from rest_framework.routers import DefaultRouter
from django.urls import path, include
from . import views

router = DefaultRouter()
router.register(r'cycles', views.EvaluationCycleViewSet)
router.register(r'competencies', views.CompetencyViewSet)
router.register(r'questions', views.QuestionViewSet)
router.register(r'evaluations', views.EvaluationViewSet)
router.register(r'answers', views.AnswerViewSet)
router.register(r'development-plans', views.DevelopmentPlanViewSet)
router.register(r'development-goals', views.DevelopmentGoalViewSet)

urlpatterns = [
    path('', include(router.urls)),
]