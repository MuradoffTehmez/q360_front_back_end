# accounts/views.py
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from .models import User
from .serializers import UserSerializer, UserCreateSerializer, LoginSerializer, PasswordResetRequestSerializer, PasswordResetConfirmSerializer, EmailVerificationSerializer, MFASetupSerializer, MFATokenSerializer, MFAEnableSerializer

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

class UserDetailView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = UserCreateSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        # Send email verification
        send_verification_email(user)
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'message': 'User registered successfully. Please check your email for verification.'
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        # Check if MFA is enabled
        if user.mfa_enabled:
            # We'll return a special response indicating MFA is required
            return Response({
                'mfa_required': True,
                'user_id': user.id,
                'message': 'MFA required'
            }, status=status.HTTP_200_OK)
        
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def mfa_verify_view(request):
    """Verify MFA token for a user"""
    serializer = MFATokenSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        user_id = request.data.get('user_id')
        try:
            user = User.objects.get(id=user_id)
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    try:
        refresh_token = request.data["refresh"]
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response(status=status.HTTP_205_RESET_CONTENT)
    except Exception:
        return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me_view(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_request_view(request):
    serializer = PasswordResetRequestSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        try:
            user = User.objects.get(email=email)
            token = user.generate_password_reset_token()
            # Send password reset email
            send_password_reset_email(user, token)
            return Response({'message': 'Password reset email sent'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            # We don't want to reveal if the email exists or not for security reasons
            return Response({'message': 'Password reset email sent'}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_confirm_view(request):
    serializer = PasswordResetConfirmSerializer(data=request.data)
    if serializer.is_valid():
        token = serializer.validated_data['token']
        new_password = serializer.validated_data['new_password']
        
        try:
            user = User.objects.get(password_reset_token=token)
            # Check if token is expired
            if user.password_reset_expires < timezone.now():
                return Response({'error': 'Token has expired'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Set new password
            user.set_password(new_password)
            user.password_reset_token = ''
            user.password_reset_expires = None
            user.save()
            
            return Response({'message': 'Password reset successfully'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_email_view(request):
    serializer = EmailVerificationSerializer(data=request.data)
    if serializer.is_valid():
        token = serializer.validated_data['token']
        try:
            user = User.objects.get(email_verification_token=token)
            user.email_verified = True
            user.email_verification_token = ''
            user.save()
            return Response({'message': 'Email verified successfully'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mfa_setup_view(request):
    """Setup MFA for a user"""
    serializer = MFASetupSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        user = request.user
        # Generate secret if not exists
        if not user.mfa_secret:
            user.generate_mfa_secret()
        
        # Generate backup codes
        backup_codes = user.generate_backup_codes()
        
        # Return QR code URL for authenticator app
        import pyotp
        totp_uri = pyotp.totp.TOTP(user.mfa_secret).provisioning_uri(
            name=user.email,
            issuer_name="Q360"
        )
        
        return Response({
            'secret': user.mfa_secret,
            'backup_codes': backup_codes,
            'qr_code_url': totp_uri
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mfa_enable_view(request):
    """Enable MFA for a user after verifying a token"""
    serializer = MFAEnableSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        user = request.user
        user.mfa_enabled = True
        user.save()
        return Response({'message': 'MFA enabled successfully'})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mfa_disable_view(request):
    """Disable MFA for a user"""
    user = request.user
    user.mfa_enabled = False
    user.mfa_secret = ''
    user.mfa_backup_codes = []
    user.save()
    return Response({'message': 'MFA disabled successfully'})

# Helper functions
def send_verification_email(user):
    """Send email verification to the user"""
    # In a real application, you would use a proper email service
    # For now, we'll just print to console but also send actual email
    print(f"Send verification email to {user.email} with token {user.email_verification_token}")
    
    # Send actual email
    try:
        send_mail(
            'Verify your email',
            f'Please verify your email by clicking this link: http://localhost:3000/verify-email?token={user.email_verification_token}',
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )
    except Exception as e:
        print(f"Failed to send verification email: {e}")

def send_password_reset_email(user, token):
    """Send password reset email to the user"""
    # In a real application, you would use a proper email service
    # For now, we'll just print to console but also send actual email
    print(f"Send password reset email to {user.email} with token {token}")
    
    # Send actual email
    try:
        send_mail(
            'Password reset',
            f'Use this link to reset your password: http://localhost:3000/reset-password?token={token}',
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )
    except Exception as e:
        print(f"Failed to send password reset email: {e}")