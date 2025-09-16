# notifications/models.py
from django.db import models
from accounts.models import User

class Notification(models.Model):
    NOTIFICATION_TYPE_CHOICES = [
        ('info', 'Information'),
        ('success', 'Success'),
        ('warning', 'Warning'),
        ('error', 'Error'),
    ]
    
    title = models.CharField(max_length=200)
    message = models.TextField()
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPE_CHOICES, default='info')
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    sender = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='sent_notifications')
    
    is_read = models.BooleanField(default=False)
    is_archived = models.BooleanField(default=False)
    
    related_object_id = models.PositiveIntegerField(null=True, blank=True)
    related_content_type = models.CharField(max_length=100, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        verbose_name = 'Notification'
        verbose_name_plural = 'Notifications'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.recipient}"

class NotificationPreference(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='notification_preferences')
    
    # Email notifications
    email_evaluations = models.BooleanField(default=True)
    email_reports = models.BooleanField(default=True)
    email_ideas = models.BooleanField(default=True)
    email_system = models.BooleanField(default=True)
    
    # In-app notifications
    in_app_evaluations = models.BooleanField(default=True)
    in_app_reports = models.BooleanField(default=True)
    in_app_ideas = models.BooleanField(default=True)
    in_app_system = models.BooleanField(default=True)
    
    # Push notifications (for mobile apps)
    push_evaluations = models.BooleanField(default=False)
    push_reports = models.BooleanField(default=False)
    push_ideas = models.BooleanField(default=False)
    push_system = models.BooleanField(default=False)
    
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Notification Preference'
        verbose_name_plural = 'Notification Preferences'
    
    def __str__(self):
        return f"Notification preferences for {self.user}"