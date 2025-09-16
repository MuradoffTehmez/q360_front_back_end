# reports/urls.py
from rest_framework.routers import DefaultRouter
from django.urls import path, include
from . import views

router = DefaultRouter()
router.register(r'templates', views.ReportTemplateViewSet)
router.register(r'generated-reports', views.GeneratedReportViewSet)
router.register(r'benchmarks', views.BenchmarkViewSet)
router.register(r'talent-matrix', views.TalentMatrixViewSet)

urlpatterns = [
    path('', include(router.urls)),
]