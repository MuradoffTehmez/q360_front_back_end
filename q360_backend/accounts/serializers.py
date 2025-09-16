# accounts/serializers.py
from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Department

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    department = DepartmentSerializer(read_only=True)
    manager = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 
            'role', 'department', 'manager', 'employee_id', 
            'hire_date', 'position', 'phone', 'avatar',
            'date_joined', 'last_login', 'email_verified', 'mfa_enabled'
        ]
        read_only_fields = ['date_joined', 'last_login', 'email_verified', 'mfa_enabled']

class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'first_name', 'last_name', 'password', 'password_confirm',
            'role', 'department', 'manager', 'employee_id', 'hire_date', 'position', 'phone'
        ]
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords do not match")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.generate_email_verification_token()  # Generate email verification token
        user.save()
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(style={'input_type': 'password'})
    
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError('Invalid credentials')
            # Check if email is verified
            if not user.email_verified:
                raise serializers.ValidationError('Email not verified')
        else:
            raise serializers.ValidationError('Must include "username" and "password"')
        
        attrs['user'] = user
        return attrs

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()
    
    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("No user found with this email address")
        return value

class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True)
    new_password_confirm = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError("Passwords do not match")
        return attrs

class EmailVerificationSerializer(serializers.Serializer):
    token = serializers.CharField()

class MFASetupSerializer(serializers.Serializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    
    def create(self, validated_data):
        user = validated_data['user']
        if not user.mfa_secret:
            user.generate_mfa_secret()
        return user

class MFATokenSerializer(serializers.Serializer):
    token = serializers.CharField(max_length=6)
    backup_code = serializers.CharField(required=False, allow_blank=True)
    
    def validate(self, attrs):
        user = self.context['request'].user
        token = attrs.get('token')
        backup_code = attrs.get('backup_code', '')
        
        # Try to verify with token first
        if user.verify_mfa_token(token):
            return attrs
        
        # If token fails, try backup code
        if backup_code and user.verify_backup_code(backup_code):
            return attrs
        
        raise serializers.ValidationError("Invalid MFA token or backup code")

class MFAEnableSerializer(serializers.Serializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    token = serializers.CharField(max_length=6)
    
    def validate_token(self, value):
        user = self.context['request'].user
        if not user.verify_mfa_token(value):
            raise serializers.ValidationError("Invalid MFA token")
        return value
    
    def update(self, instance, validated_data):
        instance.mfa_enabled = True
        instance.save()
        return instance