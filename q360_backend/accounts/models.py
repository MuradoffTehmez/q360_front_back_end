# accounts/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
from django.utils.crypto import get_random_string
from .managers import CustomUserManager

class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Department'
        verbose_name_plural = 'Departments'
    
    def __str__(self):
        return self.name

class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Administrator'),
        ('manager', 'Manager'),
        ('employee', 'Employee'),
    ]
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='employee')
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)
    manager = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='subordinates')
    employee_id = models.CharField(max_length=50, unique=True, blank=True, null=True)
    hire_date = models.DateField(blank=True, null=True)
    position = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    
    # Email verification fields
    email_verified = models.BooleanField(default=False)
    email_verification_token = models.CharField(max_length=100, blank=True)
    
    # Password reset fields
    password_reset_token = models.CharField(max_length=100, blank=True)
    password_reset_expires = models.DateTimeField(null=True, blank=True)
    
    # MFA fields
    mfa_enabled = models.BooleanField(default=False)
    mfa_secret = models.CharField(max_length=100, blank=True)
    mfa_backup_codes = models.JSONField(default=list, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    objects = CustomUserManager()
    
    def __str__(self):
        return f"{self.get_full_name() or self.username} ({self.get_role_display()})"
    
    @property
    def is_admin(self):
        return self.role == 'admin'
    
    @property
    def is_manager(self):
        return self.role == 'manager'
    
    @property
    def is_employee(self):
        return self.role == 'employee'
    
    def get_team_members(self):
        """Return all team members if user is a manager"""
        if self.is_manager:
            return User.objects.filter(manager=self)
        return User.objects.none()
    
    def generate_email_verification_token(self):
        """Generate a unique token for email verification"""
        self.email_verification_token = get_random_string(50)
        self.save()
        return self.email_verification_token
    
    def generate_password_reset_token(self):
        """Generate a unique token for password reset"""
        self.password_reset_token = get_random_string(50)
        from django.utils import timezone
        self.password_reset_expires = timezone.now() + timezone.timedelta(hours=24)
        self.save()
        return self.password_reset_token
    
    def generate_mfa_secret(self):
        """Generate a secret key for MFA"""
        import pyotp
        self.mfa_secret = pyotp.random_base32()
        self.save()
        return self.mfa_secret
    
    def generate_backup_codes(self):
        """Generate backup codes for MFA"""
        import secrets
        codes = []
        for _ in range(10):
            codes.append(secrets.token_hex(3))
        self.mfa_backup_codes = codes
        self.save()
        return codes
    
    def verify_mfa_token(self, token):
        """Verify MFA token"""
        import pyotp
        if not self.mfa_secret:
            return False
        
        totp = pyotp.TOTP(self.mfa_secret)
        return totp.verify(token)
    
    def verify_backup_code(self, code):
        """Verify backup code"""
        if code in self.mfa_backup_codes:
            # Remove the used backup code
            self.mfa_backup_codes.remove(code)
            self.save()
            return True
        return False