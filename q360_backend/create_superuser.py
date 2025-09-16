# create_superuser.py
import os
import django

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'q360.settings')
django.setup()

from accounts.models import User

# Create superuser
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser(
        username='admin',
        email='admin@q360.az',
        password='admin123'
    )
    print('Superuser created successfully!')
else:
    print('Superuser already exists!')