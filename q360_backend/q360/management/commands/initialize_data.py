# q360/management/commands/initialize_data.py
from django.core.management.base import BaseCommand
from accounts.models import Department, User
from evaluations.models import EvaluationCycle, Competency, Question
from ideas.models import IdeaCategory

class Command(BaseCommand):
    help = 'Initialize database with sample data'

    def handle(self, *args, **options):
        # Create departments
        departments_data = [
            {'name': 'İT Departamenti', 'description': 'İnformasiya texnologiyaları departamenti'},
            {'name': 'Marketinq Departamenti', 'description': 'Marketinq və brend idarəetməsi departamenti'},
            {'name': 'Satış Departamenti', 'description': 'Müştəri ilə əlaqə və satış departamenti'},
            {'name': 'HR Departamenti', 'description': 'İnsan resursları departamenti'},
        ]
        
        departments = []
        for dept_data in departments_data:
            dept, created = Department.objects.get_or_create(
                name=dept_data['name'],
                defaults=dept_data
            )
            departments.append(dept)
            if created:
                self.stdout.write(f'Created department: {dept.name}')
            else:
                self.stdout.write(f'Department already exists: {dept.name}')

        # Create admin user
        admin_user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@q360.az',
                'first_name': 'Admin',
                'last_name': 'User',
                'role': 'admin',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        if created:
            admin_user.set_password('admin123')
            admin_user.save()
            self.stdout.write('Created admin user: admin')
        else:
            self.stdout.write('Admin user already exists')

        # Create sample users
        users_data = [
            {
                'username': 'cavid',
                'email': 'cavid@q360.az',
                'first_name': 'Cavid',
                'last_name': 'Əliyev',
                'role': 'admin',
                'department': departments[0],
            },
            {
                'username': 'leyla',
                'email': 'leyla@q360.az',
                'first_name': 'Leyla',
                'last_name': 'Məmmədova',
                'role': 'manager',
                'department': departments[0],
            },
            {
                'username': 'rashad',
                'email': 'rashad@q360.az',
                'first_name': 'Rəşad',
                'last_name': 'Həsənov',
                'role': 'employee',
                'department': departments[0],
            }
        ]
        
        users = []
        for user_data in users_data:
            user, created = User.objects.get_or_create(
                username=user_data['username'],
                defaults=user_data
            )
            if created:
                user.set_password('demo123')
                user.save()
                users.append(user)
                self.stdout.write(f'Created user: {user.username}')
            else:
                users.append(user)
                self.stdout.write(f'User already exists: {user.username}')

        # Set manager relationships
        if len(users) >= 2:
            users[1].manager = None  # Leyla has no manager
            users[1].save()
            
            users[2].manager = users[1]  # Rashad's manager is Leyla
            users[2].save()

        # Create evaluation cycle
        cycle, created = EvaluationCycle.objects.get_or_create(
            name='İlkin qiymətləndirmə',
            defaults={
                'description': 'İlk 360 dərəcə qiymətləndirmə dövrü',
                'start_date': '2023-10-01',
                'end_date': '2023-12-31',
                'is_active': True,
            }
        )
        if created:
            self.stdout.write(f'Created evaluation cycle: {cycle.name}')
        else:
            self.stdout.write(f'Evaluation cycle already exists: {cycle.name}')

        # Create competencies
        competencies_data = [
            {'name': 'İş Performansı', 'order': 1, 'department': departments[0]},
            {'name': 'Komanda İşləri', 'order': 2, 'department': departments[0]},
            {'name': 'İnkişaf', 'order': 3, 'department': departments[0]},
        ]
        
        competencies = []
        for comp_data in competencies_data:
            comp, created = Competency.objects.get_or_create(
                name=comp_data['name'],
                defaults=comp_data
            )
            competencies.append(comp)
            if created:
                self.stdout.write(f'Created competency: {comp.name}')
            else:
                self.stdout.write(f'Competency already exists: {comp.name}')

        # Create questions
        questions_data = [
            {'competency': competencies[0], 'text': 'Tapşırıqları vaxtında yerinə yetirir', 'order': 1},
            {'competency': competencies[0], 'text': 'Keyfiyyətli iş təqdim edir', 'order': 2},
            {'competency': competencies[0], 'text': 'Problemləri müstəqil həll edir', 'order': 3},
            {'competency': competencies[1], 'text': 'Komanda üzvləri ilə effektiv əməkdaşlıq edir', 'order': 1},
            {'competency': competencies[1], 'text': 'Məsuliyyətli davranır', 'order': 2},
            {'competency': competencies[2], 'text': 'Yeni texnologiyaları öyrənir', 'order': 1},
            {'competency': competencies[2], 'text': 'Özünü inkişaf etdirməyə çalışır', 'order': 2},
        ]
        
        for ques_data in questions_data:
            ques, created = Question.objects.get_or_create(
                competency=ques_data['competency'],
                text=ques_data['text'],
                defaults=ques_data
            )
            if created:
                self.stdout.write(f'Created question: {ques.text[:50]}...')
            else:
                self.stdout.write(f'Question already exists: {ques.text[:50]}...')

        # Create idea categories
        categories_data = [
            {'name': 'İT İdeyaları', 'description': 'İnformasiya texnologiyaları sahəsində təkliflər', 'color': '#007BFF'},
            {'name': 'İş Prosesləri', 'description': 'İş proseslərinin təkmilləşdirilməsi', 'color': '#28A745'},
            {'name': 'Ofis Mühiti', 'description': 'Ofis mühiti və təşkilat', 'color': '#FFC107'},
        ]
        
        for cat_data in categories_data:
            cat, created = IdeaCategory.objects.get_or_create(
                name=cat_data['name'],
                defaults=cat_data
            )
            if created:
                self.stdout.write(f'Created idea category: {cat.name}')
            else:
                self.stdout.write(f'Idea category already exists: {cat.name}')

        self.stdout.write(
            self.style.SUCCESS('Successfully initialized sample data')
        )