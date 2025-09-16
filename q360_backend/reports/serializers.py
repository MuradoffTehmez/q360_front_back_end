# reports/serializers.py
from rest_framework import serializers
from .models import ReportTemplate, GeneratedReport, Benchmark, TalentMatrix
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