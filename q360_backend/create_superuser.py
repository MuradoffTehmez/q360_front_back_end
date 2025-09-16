import os
import django

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'q360.settings')
django.setup()

from accounts.models import User

# Create a superuser
user = User.objects.create_superuser(
    username='admin',
    email='admin@example.com',
    password='admin123',
    first_name='Admin',
    last_name='User'
)

print(f"Superuser created: {user.username}")