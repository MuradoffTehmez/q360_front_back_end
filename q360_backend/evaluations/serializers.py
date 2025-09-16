# evaluations/serializers.py
from rest_framework import serializers
from .models import (
    EvaluationCycle, Competency, Question, 
    Evaluation, Answer, DevelopmentPlan, DevelopmentGoal
)
from accounts.models import User, Department

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'role', 'position']

class EvaluationCycleSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvaluationCycle
        fields = '__all__'

class CompetencySerializer(serializers.ModelSerializer):
    department = DepartmentSerializer(read_only=True)
    
    class Meta:
        model = Competency
        fields = '__all__'

class QuestionSerializer(serializers.ModelSerializer):
    competency = CompetencySerializer(read_only=True)
    
    class Meta:
        model = Question
        fields = '__all__'

class AnswerSerializer(serializers.ModelSerializer):
    question = QuestionSerializer(read_only=True)
    
    class Meta:
        model = Answer
        fields = '__all__'

class EvaluationSerializer(serializers.ModelSerializer):
    evaluatee = UserSerializer(read_only=True)
    evaluator = UserSerializer(read_only=True)
    cycle = EvaluationCycleSerializer(read_only=True)
    answers = AnswerSerializer(many=True, read_only=True)
    
    class Meta:
        model = Evaluation
        fields = '__all__'

class DevelopmentGoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = DevelopmentGoal
        fields = '__all__'

class DevelopmentPlanSerializer(serializers.ModelSerializer):
    employee = UserSerializer(read_only=True)
    goals = DevelopmentGoalSerializer(many=True, read_only=True)
    
    class Meta:
        model = DevelopmentPlan
        fields = '__all__'