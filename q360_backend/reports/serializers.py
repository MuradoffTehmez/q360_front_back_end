# reports/serializers.py
from rest_framework import serializers
from .models import ReportTemplate, GeneratedReport, Benchmark, TalentMatrix, DashboardMetric, DashboardWidget
from accounts.models import User, Department
from evaluations.models import EvaluationCycle, Competency

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class EvaluationCycleSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvaluationCycle
        fields = '__all__'

class CompetencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Competency
        fields = '__all__'

class ReportTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportTemplate
        fields = '__all__'

class GeneratedReportSerializer(serializers.ModelSerializer):
    template = ReportTemplateSerializer(read_only=True)
    generated_by = UserSerializer(read_only=True)
    cycle = EvaluationCycleSerializer(read_only=True)
    department = DepartmentSerializer(read_only=True)
    employee = UserSerializer(read_only=True)
    
    class Meta:
        model = GeneratedReport
        fields = '__all__'

class BenchmarkSerializer(serializers.ModelSerializer):
    competency = CompetencySerializer(read_only=True)
    
    class Meta:
        model = Benchmark
        fields = '__all__'

class TalentMatrixSerializer(serializers.ModelSerializer):
    employee = UserSerializer(read_only=True)
    cycle = EvaluationCycleSerializer(read_only=True)
    
    class Meta:
        model = TalentMatrix
        fields = '__all__'

class DashboardMetricSerializer(serializers.ModelSerializer):
    department = DepartmentSerializer(read_only=True)
    employee = UserSerializer(read_only=True)
    cycle = EvaluationCycleSerializer(read_only=True)
    
    class Meta:
        model = DashboardMetric
        fields = '__all__'

class DashboardWidgetSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    department = DepartmentSerializer(read_only=True)
    
    class Meta:
        model = DashboardWidget
        fields = '__all__'

class DashboardSummarySerializer(serializers.Serializer):
    # Admin dashboard data
    total_users = serializers.IntegerField()
    total_ideas = serializers.IntegerField()
    total_evaluations = serializers.IntegerField()
    pending_evaluations = serializers.IntegerField()
    
    # Manager dashboard data
    team_members = serializers.IntegerField()
    team_evaluations = serializers.IntegerField()
    pending_team_evaluations = serializers.IntegerField()
    team_performance = serializers.IntegerField()
    
    # Employee dashboard data
    my_evaluations = serializers.IntegerField()
    pending_my_evaluations = serializers.IntegerField()
    my_ideas = serializers.IntegerField()
    performance_score = serializers.IntegerField()
    
    # Common data
    recent_activities = serializers.ListField(
        child=serializers.DictField()
    )