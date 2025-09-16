# evaluations/models.py
from django.db import models
from accounts.models import User, Department

class EvaluationCycle(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    start_date = models.DateField()
    end_date = models.DateField()
    is_active = models.BooleanField(default=True)
    is_anonymous = models.BooleanField(default=False)
    allow_self_evaluation = models.BooleanField(default=True)
    allow_peer_evaluation = models.BooleanField(default=True)
    allow_manager_evaluation = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Evaluation Cycle'
        verbose_name_plural = 'Evaluation Cycles'
    
    def __str__(self):
        return self.name

class Competency(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, null=True, blank=True)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        verbose_name = 'Competency'
        verbose_name_plural = 'Competencies'
        ordering = ['order']
    
    def __str__(self):
        return self.name

class Question(models.Model):
    competency = models.ForeignKey(Competency, on_delete=models.CASCADE, related_name='questions')
    text = models.TextField()
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return f"{self.competency.name} - {self.text[:50]}..."

class Evaluation(models.Model):
    EVALUATION_TYPE_CHOICES = [
        ('self', 'Self Evaluation'),
        ('peer', 'Peer Evaluation'),
        ('manager', 'Manager Evaluation'),
    ]
    
    cycle = models.ForeignKey(EvaluationCycle, on_delete=models.CASCADE)
    evaluatee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='evaluations_received')
    evaluator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='evaluations_given')
    evaluation_type = models.CharField(max_length=20, choices=EVALUATION_TYPE_CHOICES)
    
    submitted_at = models.DateTimeField(null=True, blank=True)
    is_submitted = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['cycle', 'evaluatee', 'evaluator', 'evaluation_type']
        verbose_name = 'Evaluation'
        verbose_name_plural = 'Evaluations'
    
    def __str__(self):
        return f"{self.cycle.name} - {self.evaluatee} by {self.evaluator}"

class Answer(models.Model):
    evaluation = models.ForeignKey(Evaluation, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    rating = models.IntegerField(choices=[(i, str(i)) for i in range(1, 6)])  # 1-5 scale
    comment = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['evaluation', 'question']
        verbose_name = 'Answer'
        verbose_name_plural = 'Answers'
    
    def __str__(self):
        return f"Answer to {self.question.text[:30]}... ({self.rating})"

class DevelopmentPlan(models.Model):
    employee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='development_plans')
    title = models.CharField(max_length=200)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=20, choices=[
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ], default='not_started')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Development Plan'
        verbose_name_plural = 'Development Plans'
    
    def __str__(self):
        return f"{self.employee} - {self.title}"

class DevelopmentGoal(models.Model):
    plan = models.ForeignKey(DevelopmentPlan, on_delete=models.CASCADE, related_name='goals')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    due_date = models.DateField()
    is_completed = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Development Goal'
        verbose_name_plural = 'Development Goals'
    
    def __str__(self):
        return self.title