# reports/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from .models import ReportTemplate, GeneratedReport, Benchmark, TalentMatrix
from .serializers import (
    ReportTemplateSerializer, GeneratedReportSerializer, 
    BenchmarkSerializer, TalentMatrixSerializer
)
from accounts.models import User
from evaluations.models import Evaluation
from ideas.models import Idea

class ReportTemplateViewSet(viewsets.ModelViewSet):
    queryset = ReportTemplate.objects.all()
    serializer_class = ReportTemplateSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category', 'is_active']
    search_fields = ['name', 'description']

class GeneratedReportViewSet(viewsets.ModelViewSet):
    queryset = GeneratedReport.objects.all()
    serializer_class = GeneratedReportSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['template', 'format', 'generated_by', 'cycle', 'department', 'employee']
    search_fields = ['title']
    ordering_fields = ['generated_at']

class BenchmarkViewSet(viewsets.ModelViewSet):
    queryset = Benchmark.objects.all()
    serializer_class = BenchmarkSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['competency']
    search_fields = ['name', 'description']

class TalentMatrixViewSet(viewsets.ModelViewSet):
    queryset = TalentMatrix.objects.all()
    serializer_class = TalentMatrixSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['employee', 'cycle', 'quadrant']

class DashboardViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    def list(self, request):
        user = request.user
        
        # Get dashboard summary data
        if user.is_admin:
            # Admin dashboard data
            total_users = User.objects.count()
            total_ideas = Idea.objects.count()
            total_evaluations = Evaluation.objects.count()
            pending_evaluations = Evaluation.objects.filter(is_submitted=False).count()
            
            data = {
                'total_users': total_users,
                'total_ideas': total_ideas,
                'total_evaluations': total_evaluations,
                'pending_evaluations': pending_evaluations,
                'recent_activities': [
                    {'text': 'Yeni istifadəçi qeydiyyatdan keçdi', 'time': '2 saat əvvəl'},
                    {'text': 'Yeni fikir təqdim edildi', 'time': '5 saat əvvəl'},
                    {'text': 'Qiymətləndirmə tamamlandı', 'time': '1 gün əvvəl'},
                ]
            }
        elif user.is_manager:
            # Manager dashboard data
            team_members = User.objects.filter(manager=user).count()
            team_evaluations = Evaluation.objects.filter(evaluatee__manager=user).count()
            pending_team_evaluations = Evaluation.objects.filter(
                evaluatee__manager=user, 
                is_submitted=False
            ).count()
            
            data = {
                'team_members': team_members,
                'team_evaluations': team_evaluations,
                'pending_team_evaluations': pending_team_evaluations,
                'team_performance': 85,  # Mock data
                'recent_activities': [
                    {'text': 'Komanda üzvü qiymətləndirməsini tamamladı', 'time': '3 saat əvvəl'},
                    {'text': 'Yeni komanda yaradıldı', 'time': '1 gün əvvəl'},
                ]
            }
        else:
            # Employee dashboard data
            my_evaluations = Evaluation.objects.filter(evaluatee=user).count()
            pending_evaluations = Evaluation.objects.filter(
                evaluatee=user, 
                is_submitted=False
            ).count()
            my_ideas = Idea.objects.filter(submitter=user).count()
            
            data = {
                'my_evaluations': my_evaluations,
                'pending_my_evaluations': pending_evaluations,
                'my_ideas': my_ideas,
                'performance_score': 78,  # Mock data
                'recent_activities': [
                    {'text': 'Qiymətləndirmə forması tamamlandı', 'time': '2 saat əvvəl'},
                    {'text': 'Yeni fikir təqdim edildi', 'time': '1 gün əvvəl'},
                ]
            }
        
        return Response(data)