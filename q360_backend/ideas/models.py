# ideas/models.py
from django.db import models
from accounts.models import User, Department

class IdeaCategory(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    color = models.CharField(max_length=7, default='#007BFF')  # Hex color code
    
    class Meta:
        verbose_name = 'Idea Category'
        verbose_name_plural = 'Idea Categories'
    
    def __str__(self):
        return self.name

class Idea(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('under_review', 'Under Review'),
        ('approved', 'Approved'),
        ('implemented', 'Implemented'),
        ('rejected', 'Rejected'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.ForeignKey(IdeaCategory, on_delete=models.SET_NULL, null=True, blank=True)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)
    submitter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='submitted_ideas')
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='submitted')
    implementation_date = models.DateField(null=True, blank=True)
    
    likes_count = models.PositiveIntegerField(default=0)
    views_count = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Idea'
        verbose_name_plural = 'Ideas'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title

class IdeaLike(models.Model):
    idea = models.ForeignKey(Idea, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['idea', 'user']
        verbose_name = 'Idea Like'
        verbose_name_plural = 'Idea Likes'
    
    def __str__(self):
        return f"{self.user} liked {self.idea}"

class IdeaComment(models.Model):
    idea = models.ForeignKey(Idea, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Idea Comment'
        verbose_name_plural = 'Idea Comments'
        ordering = ['created_at']
    
    def __str__(self):
        return f"Comment by {self.author} on {self.idea}"