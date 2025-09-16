# evaluations/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from .models import (
    EvaluationCycle, Competency, Question, 
    Evaluation, Answer, DevelopmentPlan, DevelopmentGoal
)
from .serializers import (
    EvaluationCycleSerializer, CompetencySerializer, QuestionSerializer,
    EvaluationSerializer, AnswerSerializer, DevelopmentPlanSerializer, DevelopmentGoalSerializer
)

class EvaluationCycleViewSet(viewsets.ModelViewSet):
    queryset = EvaluationCycle.objects.all()
    serializer_class = EvaluationCycleSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active']
    search_fields = ['name', 'description']
    ordering_fields = ['start_date', 'end_date', 'created_at']

class CompetencyViewSet(viewsets.ModelViewSet):
    queryset = Competency.objects.all()
    serializer_class = CompetencySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['name', 'description']

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['competency']
    search_fields = ['text']

class EvaluationViewSet(viewsets.ModelViewSet):
    queryset = Evaluation.objects.all()
    serializer_class = EvaluationSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['cycle', 'evaluatee', 'evaluator', 'evaluation_type', 'is_submitted']
    search_fields = ['cycle__name']

    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        evaluation = self.get_object()
        evaluation.is_submitted = True
        evaluation.save()
        return Response({'status': 'Evaluation submitted successfully'})

class AnswerViewSet(viewsets.ModelViewSet):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['evaluation', 'question']

class DevelopmentPlanViewSet(viewsets.ModelViewSet):
    queryset = DevelopmentPlan.objects.all()
    serializer_class = DevelopmentPlanSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['employee', 'status']
    search_fields = ['title', 'description']

class DevelopmentGoalViewSet(viewsets.ModelViewSet):
    queryset = DevelopmentGoal.objects.all()
    serializer_class = DevelopmentGoalSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['plan', 'is_completed']