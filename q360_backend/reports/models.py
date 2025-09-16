# reports/models.py
from django.db import models
from accounts.models import User, Department
from evaluations.models import EvaluationCycle, Competency

class ReportTemplate(models.Model):
    CATEGORY_CHOICES = [
        ('individual', 'Individual'),
        ('team', 'Team'),
        ('department', 'Department'),
        ('company', 'Company'),
    ]
    
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Report Template'
        verbose_name_plural = 'Report Templates'
    
    def __str__(self):
        return self.name

class GeneratedReport(models.Model):
    REPORT_FORMAT_CHOICES = [
        ('pdf', 'PDF'),
        ('excel', 'Excel'),
        ('csv', 'CSV'),
    ]
    
    template = models.ForeignKey(ReportTemplate, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    content = models.JSONField()  # Store report data as JSON
    format = models.CharField(max_length=10, choices=REPORT_FORMAT_CHOICES, default='pdf')
    
    generated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    generated_at = models.DateTimeField(auto_now_add=True)
    
    # Filters used to generate this report
    cycle = models.ForeignKey(EvaluationCycle, on_delete=models.SET_NULL, null=True, blank=True)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)
    employee = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='reports')
    
    file_path = models.CharField(max_length=500, blank=True)
    
    class Meta:
        verbose_name = 'Generated Report'
        verbose_name_plural = 'Generated Reports'
        ordering = ['-generated_at']
    
    def __str__(self):
        return self.title

class Benchmark(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    competency = models.ForeignKey(Competency, on_delete=models.CASCADE)
    
    # Benchmark values
    excellent_min = models.FloatField()
    good_min = models.FloatField()
    average_min = models.FloatField()
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Benchmark'
        verbose_name_plural = 'Benchmarks'
    
    def __str__(self):
        return f"{self.name} - {self.competency.name}"

class TalentMatrix(models.Model):
    employee = models.ForeignKey(User, on_delete=models.CASCADE)
    cycle = models.ForeignKey(EvaluationCycle, on_delete=models.CASCADE)
    
    # Performance and potential scores (1-10 scale)
    performance_score = models.FloatField()
    potential_score = models.FloatField()
    
    # Quadrant placement
    QUADRANT_CHOICES = [
        ('high_perf_high_pot', 'High Performance, High Potential'),
        ('high_perf_low_pot', 'High Performance, Low Potential'),
        ('low_perf_high_pot', 'Low Performance, High Potential'),
        ('low_perf_low_pot', 'Low Performance, Low Potential'),
    ]
    quadrant = models.CharField(max_length=30, choices=QUADRANT_CHOICES)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['employee', 'cycle']
        verbose_name = 'Talent Matrix'
        verbose_name_plural = 'Talent Matrices'
    
    def __str__(self):
        return f"{self.employee} - {self.cycle.name}"