# Technical Specifications for Q360 Platform Features

## Overview
This document provides detailed technical specifications for each feature of the Q360 Performance Management Platform, based on the design documentation and implementation requirements.

## 1. Authentication & User Management System

### 1.1 Backend Specifications

#### Models
```python
# accounts/models.py
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
    email_verified = models.BooleanField(default=False)
    last_password_reset = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    emergency_contact = models.CharField(max_length=100, blank=True)
    address = models.TextField(blank=True)
    timezone = models.CharField(max_length=50, default='UTC')
    language = models.CharField(max_length=10, default='en')
    profile_completeness = models.IntegerField(default=0)  # Percentage
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

#### API Endpoints
```
POST /api/auth/register/ - User registration
POST /api/auth/login/ - User login
POST /api/auth/logout/ - User logout
POST /api/auth/password-reset/request/ - Password reset request
POST /api/auth/password-reset/confirm/ - Password reset confirmation
POST /api/auth/verify-email/ - Email verification
GET /api/auth/me/ - Get current user
PUT /api/auth/me/ - Update current user
PUT /api/auth/me/password/ - Change password
POST /api/auth/mfa/setup/ - Setup MFA
POST /api/auth/mfa/verify/ - Verify MFA code
GET /api/users/ - List users (admin/manager only)
GET /api/users/{id}/ - Get user details
PUT /api/users/{id}/ - Update user (admin only)
DELETE /api/users/{id}/ - Delete user (admin only)
```

#### Serializers
```python
# accounts/serializers.py
class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords do not match")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'department', 
                  'manager', 'employee_id', 'hire_date', 'position', 'phone', 'avatar', 
                  'is_active', 'date_joined']
        read_only_fields = ['id', 'date_joined']

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['bio', 'date_of_birth', 'emergency_contact', 'address', 'timezone', 
                  'language', 'profile_completeness']
```

### 1.2 Frontend Specifications

#### Authentication Service
```typescript
// services/AuthService.ts
interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'employee';
  department?: Department;
  manager?: User;
  employeeId?: string;
  hireDate?: string;
  position?: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  dateJoined: string;
}

interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

class AuthService {
  static async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/register/', userData);
    return response.data;
  }
  
  static async login(credentials: LoginData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/login/', credentials);
    return response.data;
  }
  
  static async logout(): Promise<void> {
    await api.post('/api/auth/logout/');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
  
  static async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await api.post<{ access: string }>('/api/auth/token/refresh/', {
      refresh: refreshToken
    });
    localStorage.setItem('accessToken', response.data.access);
    return response.data.access;
  }
  
  static async resetPasswordRequest(email: string): Promise<void> {
    await api.post('/api/auth/password-reset/request/', { email });
  }
  
  static async resetPasswordConfirm(uid: string, token: string, newPassword: string): Promise<void> {
    await api.post('/api/auth/password-reset/confirm/', {
      uid,
      token,
      new_password: newPassword
    });
  }
}
```

#### Authentication Components
```typescript
// components/LoginForm.tsx
interface LoginFormProps {
  onLoginSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      try {
        const response = await AuthService.login({ email, password });
        if (rememberMe) {
          localStorage.setItem('accessToken', response.access);
          localStorage.setItem('refreshToken', response.refresh);
        } else {
          sessionStorage.setItem('accessToken', response.access);
        }
        onLoginSuccess();
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  // Implementation details...
};
```

## 2. Dashboard

### 2.1 Backend Specifications

#### API Endpoints
```
GET /api/dashboard/summary/ - Get dashboard summary data
GET /api/dashboard/tasks/ - Get pending tasks
GET /api/dashboard/activities/ - Get recent activities
GET /api/dashboard/performance/ - Get performance data
GET /api/dashboard/participation/ - Get participation metrics
```

#### Serializers
```python
class DashboardSummarySerializer(serializers.Serializer):
    pending_tasks = serializers.IntegerField()
    performance_score = serializers.FloatField()
    recent_activities = serializers.IntegerField()
    participation_rate = serializers.FloatField()

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'due_date', 'priority', 'status']

class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ['id', 'description', 'timestamp', 'type']

class PerformanceDataSerializer(serializers.Serializer):
    labels = serializers.ListField(child=serializers.CharField())
    data = serializers.ListField(child=serializers.FloatField())

class ParticipationDataSerializer(serializers.Serializer):
    rate = serializers.FloatField()
    total_evaluations = serializers.IntegerField()
    completed_evaluations = serializers.IntegerField()
```

### 2.2 Frontend Specifications

#### Dashboard Components
```typescript
// components/dashboard/TaskWidget.tsx
interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
}

const TaskWidget: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchTasks();
  }, []);
  
  const fetchTasks = async () => {
    try {
      const response = await api.get<Task[]>('/api/dashboard/tasks/');
      setTasks(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };
  
  // Implementation details...
};
```

## 3. 360-Degree Evaluation System

### 3.1 Backend Specifications

#### Models
```python
# evaluations/models.py
class EvaluationCycle(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    start_date = models.DateField()
    end_date = models.DateField()
    is_active = models.BooleanField(default=False)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class QuestionTemplate(models.Model):
    TEXT = 'text'
    RATING = 'rating'
    CHOICE = 'choice'
    
    QUESTION_TYPES = [
        (TEXT, 'Text'),
        (RATING, 'Rating'),
        (CHOICE, 'Multiple Choice'),
    ]
    
    text = models.TextField()
    question_type = models.CharField(max_length=20, choices=QUESTION_TYPES, default=TEXT)
    options = models.JSONField(blank=True, null=True)  # For multiple choice questions
    is_required = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

class EvaluationForm(models.Model):
    cycle = models.ForeignKey(EvaluationCycle, on_delete=models.CASCADE)
    respondent = models.ForeignKey(User, on_delete=models.CASCADE, related_name='evaluations_responded')
    subject = models.ForeignKey(User, on_delete=models.CASCADE, related_name='evaluations_received')
    status = models.CharField(max_length=20, choices=[
        ('draft', 'Draft'),
        ('sent', 'Sent'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ], default='sent')
    sent_date = models.DateTimeField(auto_now_add=True)
    completed_date = models.DateTimeField(null=True, blank=True)
    last_saved = models.DateTimeField(auto_now=True)

class EvaluationQuestion(models.Model):
    form = models.ForeignKey(EvaluationForm, on_delete=models.CASCADE, related_name='questions')
    template = models.ForeignKey(QuestionTemplate, on_delete=models.CASCADE)
    response_text = models.TextField(blank=True)
    response_rating = models.IntegerField(null=True, blank=True)
    response_choice = models.CharField(max_length=200, blank=True)
    order = models.IntegerField()
```

#### API Endpoints
```
GET /api/evaluations/cycles/ - List evaluation cycles
POST /api/evaluations/cycles/ - Create evaluation cycle
GET /api/evaluations/cycles/{id}/ - Get evaluation cycle details
PUT /api/evaluations/cycles/{id}/ - Update evaluation cycle
DELETE /api/evaluations/cycles/{id}/ - Delete evaluation cycle
GET /api/evaluations/templates/ - List question templates
POST /api/evaluations/templates/ - Create question template
GET /api/evaluations/templates/{id}/ - Get question template
PUT /api/evaluations/templates/{id}/ - Update question template
DELETE /api/evaluations/templates/{id}/ - Delete question template
GET /api/evaluations/forms/ - List evaluation forms
POST /api/evaluations/forms/ - Create evaluation form
GET /api/evaluations/forms/{id}/ - Get evaluation form
PUT /api/evaluations/forms/{id}/ - Update evaluation form
DELETE /api/evaluations/forms/{id}/ - Delete evaluation form
POST /api/evaluations/forms/{id}/submit/ - Submit evaluation form
POST /api/evaluations/forms/{id}/save/ - Save evaluation form (autosave)
```

### 3.2 Frontend Specifications

#### Evaluation Components
```typescript
// components/evaluation/EvaluationForm.tsx
interface EvaluationFormProps {
  formId: number;
  onSubmit: () => void;
  onSave: () => void;
}

const EvaluationForm: React.FC<EvaluationFormProps> = ({ formId, onSubmit, onSave }) => {
  const [formData, setFormData] = useState<EvaluationFormData | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    fetchFormData();
  }, [formId]);
  
  const fetchFormData = async () => {
    try {
      const response = await api.get<EvaluationFormData>(`/api/evaluations/forms/${formId}/`);
      setFormData(response.data);
    } catch (error) {
      handleError(error);
    }
  };
  
  const handleSave = async () => {
    if (!formData) return;
    
    setIsSaving(true);
    try {
      await api.post(`/api/evaluations/forms/${formId}/save/`, formData);
      onSave();
    } catch (error) {
      handleError(error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSubmit = async () => {
    if (!formData) return;
    
    try {
      await api.post(`/api/evaluations/forms/${formId}/submit/`, formData);
      onSubmit();
    } catch (error) {
      handleError(error);
    }
  };
  
  // Implementation details...
};
```

## 4. Idea Bank

### 4.1 Backend Specifications

#### Models
```python
# ideas/models.py
class IdeaCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    color = models.CharField(max_length=7, default='#007BFF')  # Hex color code
    created_at = models.DateTimeField(auto_now_add=True)

class Idea(models.Model):
    DRAFT = 'draft'
    SUBMITTED = 'submitted'
    IN_REVIEW = 'in_review'
    IMPLEMENTED = 'implemented'
    REJECTED = 'rejected'
    
    STATUS_CHOICES = [
        (DRAFT, 'Draft'),
        (SUBMITTED, 'Submitted'),
        (IN_REVIEW, 'In Review'),
        (IMPLEMENTED, 'Implemented'),
        (REJECTED, 'Rejected'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.ForeignKey(IdeaCategory, on_delete=models.SET_NULL, null=True, blank=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ideas')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=DRAFT)
    implementation_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class IdeaVote(models.Model):
    idea = models.ForeignKey(Idea, on_delete=models.CASCADE, related_name='votes')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    vote_type = models.CharField(max_length=10, choices=[('up', 'Upvote'), ('down', 'Downvote')])
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('idea', 'user')

class IdeaComment(models.Model):
    idea = models.ForeignKey(Idea, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

#### API Endpoints
```
GET /api/ideas/categories/ - List idea categories
POST /api/ideas/categories/ - Create idea category
GET /api/ideas/categories/{id}/ - Get idea category
PUT /api/ideas/categories/{id}/ - Update idea category
DELETE /api/ideas/categories/{id}/ - Delete idea category
GET /api/ideas/ - List ideas
POST /api/ideas/ - Create idea
GET /api/ideas/{id}/ - Get idea
PUT /api/ideas/{id}/ - Update idea
DELETE /api/ideas/{id}/ - Delete idea
POST /api/ideas/{id}/vote/ - Vote on idea
DELETE /api/ideas/{id}/vote/ - Remove vote
GET /api/ideas/{id}/comments/ - List comments
POST /api/ideas/{id}/comments/ - Add comment
PUT /api/ideas/comments/{id}/ - Update comment
DELETE /api/ideas/comments/{id}/ - Delete comment
GET /api/ideas/leaderboard/ - Get idea leaderboard
```

### 4.2 Frontend Specifications

#### Idea Bank Components
```typescript
// components/ideas/IdeaCard.tsx
interface Idea {
  id: number;
  title: string;
  description: string;
  category: IdeaCategory;
  author: User;
  status: 'draft' | 'submitted' | 'in_review' | 'implemented' | 'rejected';
  voteCount: number;
  commentCount: number;
  userVote: 'up' | 'down' | null;
  createdAt: string;
}

const IdeaCard: React.FC<{ idea: Idea; onVote: (voteType: 'up' | 'down') => void }> = ({ 
  idea, 
  onVote 
}) => {
  const handleVote = (voteType: 'up' | 'down') => {
    // Prevent duplicate voting
    if (idea.userVote === voteType) {
      onVote('down'); // Remove vote
    } else {
      onVote(voteType);
    }
  };
  
  // Implementation details...
};
```

## 5. Notification System

### 5.1 Backend Specifications

#### Models
```python
# notifications/models.py
class NotificationTemplate(models.Model):
    name = models.CharField(max_length=100, unique=True)
    subject = models.CharField(max_length=200)
    body = models.TextField()
    channel = models.CharField(max_length=20, choices=[
        ('in_app', 'In-App'),
        ('email', 'Email'),
        ('slack', 'Slack'),
        ('teams', 'Microsoft Teams'),
    ])
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Notification(models.Model):
    INFO = 'info'
    SUCCESS = 'success'
    WARNING = 'warning'
    ERROR = 'error'
    
    TYPE_CHOICES = [
        (INFO, 'Info'),
        (SUCCESS, 'Success'),
        (WARNING, 'Warning'),
        (ERROR, 'Error'),
    ]
    
    template = models.ForeignKey(NotificationTemplate, on_delete=models.SET_NULL, null=True, blank=True)
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=200)
    message = models.TextField()
    notification_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default=INFO)
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    action_url = models.URLField(blank=True)
    category = models.CharField(max_length=50, blank=True)
    priority = models.CharField(max_length=20, choices=[
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ], default='medium')
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)

class NotificationPreference(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='notification_preferences')
    in_app_enabled = models.BooleanField(default=True)
    email_enabled = models.BooleanField(default=True)
    slack_enabled = models.BooleanField(default=False)
    teams_enabled = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

#### API Endpoints
```
GET /api/notifications/ - List notifications
GET /api/notifications/unread-count/ - Get unread notification count
GET /api/notifications/{id}/ - Get notification
PUT /api/notifications/{id}/ - Update notification (mark as read)
DELETE /api/notifications/{id}/ - Delete notification
POST /api/notifications/mark-all-read/ - Mark all notifications as read
GET /api/notifications/preferences/ - Get notification preferences
PUT /api/notifications/preferences/ - Update notification preferences
```

### 5.2 Frontend Specifications

#### Notification Components
```typescript
// components/notifications/NotificationCenter.tsx
interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  category: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  actionUrl?: string;
}

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);
  
  const fetchNotifications = async () => {
    try {
      const response = await api.get<Notification[]>('/api/notifications/');
      setNotifications(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchUnreadCount = async () => {
    try {
      const response = await api.get<{ count: number }>('/api/notifications/unread-count/');
      setUnreadCount(response.data.count);
    } catch (error) {
      handleError(error);
    }
  };
  
  const markAsRead = async (id: number) => {
    try {
      await api.put(`/api/notifications/${id}/`, { is_read: true });
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      ));
      setUnreadCount(unreadCount - 1);
    } catch (error) {
      handleError(error);
    }
  };
  
  // Implementation details...
};
```

## 6. Reporting & Analytics

### 6.1 Backend Specifications

#### Models
```python
# reports/models.py
class ReportTemplate(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=50, choices=[
        ('individual', 'Individual'),
        ('team', 'Team'),
        ('department', 'Department'),
        ('company', 'Company'),
    ])
    is_public = models.BooleanField(default=False)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class CustomReport(models.Model):
    name = models.CharField(max_length=200)
    template = models.ForeignKey(ReportTemplate, on_delete=models.CASCADE)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='custom_reports')
    filters = models.JSONField(blank=True, null=True)
    chart_type = models.CharField(max_length=50, choices=[
        ('bar', 'Bar Chart'),
        ('line', 'Line Chart'),
        ('pie', 'Pie Chart'),
        ('radar', 'Radar Chart'),
        ('table', 'Data Table'),
    ])
    data_source = models.CharField(max_length=100)
    is_public = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

#### API Endpoints
```
GET /api/reports/templates/ - List report templates
POST /api/reports/templates/ - Create report template
GET /api/reports/templates/{id}/ - Get report template
PUT /api/reports/templates/{id}/ - Update report template
DELETE /api/reports/templates/{id}/ - Delete report template
GET /api/reports/custom/ - List custom reports
POST /api/reports/custom/ - Create custom report
GET /api/reports/custom/{id}/ - Get custom report
PUT /api/reports/custom/{id}/ - Update custom report
DELETE /api/reports/custom/{id}/ - Delete custom report
POST /api/reports/custom/{id}/generate/ - Generate report data
GET /api/reports/custom/{id}/export/ - Export report (PDF, CSV)
GET /api/reports/dashboard/ - Get dashboard report data
GET /api/reports/benchmarking/ - Get benchmarking data
```

### 6.2 Frontend Specifications

#### Report Components
```typescript
// components/reports/ReportBuilder.tsx
interface ReportTemplate {
  id: number;
  name: string;
  description: string;
  category: 'individual' | 'team' | 'department' | 'company';
  isPublic: boolean;
}

interface CustomReport {
  id: number;
  name: string;
  template: ReportTemplate;
  filters: Record<string, any>;
  chartType: 'bar' | 'line' | 'pie' | 'radar' | 'table';
  dataSource: string;
  isPublic: boolean;
}

const ReportBuilder: React.FC = () => {
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [reportData, setReportData] = useState<any>(null);
  const [filters, setFilters] = useState<Record<string, any>>({});
  
  const generateReport = async () => {
    if (!selectedTemplate) return;
    
    try {
      const response = await api.post(`/api/reports/custom/${selectedTemplate.id}/generate/`, {
        filters,
      });
      setReportData(response.data);
    } catch (error) {
      handleError(error);
    }
  };
  
  // Implementation details...
};
```

## 7. Development & Training Modules

### 7.1 Backend Specifications

#### Models
```python
# development/models.py
class DevelopmentGoal(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='development_goals')
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=50, choices=[
        ('skill', 'Skill Development'),
        ('career', 'Career Advancement'),
        ('performance', 'Performance Improvement'),
    ])
    priority = models.CharField(max_length=20, choices=[
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ], default='medium')
    status = models.CharField(max_length=20, choices=[
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ], default='not_started')
    start_date = models.DateField()
    target_date = models.DateField()
    completion_date = models.DateField(null=True, blank=True)
    progress = models.IntegerField(default=0)  # Percentage
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Skill(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class GoalSkill(models.Model):
    goal = models.ForeignKey(DevelopmentGoal, on_delete=models.CASCADE)
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)
    proficiency_level = models.CharField(max_length=20, choices=[
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
        ('expert', 'Expert'),
    ])
    target_level = models.CharField(max_length=20, choices=[
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
        ('expert', 'Expert'),
    ])
    
    class Meta:
        unique_together = ('goal', 'skill')

class TrainingResource(models.Model):
    ONLINE_COURSE = 'online_course'
    BOOK = 'book'
    VIDEO = 'video'
    DOCUMENT = 'document'
    WORKSHOP = 'workshop'
    
    RESOURCE_TYPES = [
        (ONLINE_COURSE, 'Online Course'),
        (BOOK, 'Book'),
        (VIDEO, 'Video'),
        (DOCUMENT, 'Document'),
        (WORKSHOP, 'Workshop'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    resource_type = models.CharField(max_length=20, choices=RESOURCE_TYPES)
    url = models.URLField(blank=True)
    duration = models.CharField(max_length=50, blank=True)  # e.g., "2 hours", "3 days"
    skills = models.ManyToManyField(Skill, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

#### API Endpoints
```
GET /api/development/goals/ - List development goals
POST /api/development/goals/ - Create development goal
GET /api/development/goals/{id}/ - Get development goal
PUT /api/development/goals/{id}/ - Update development goal
DELETE /api/development/goals/{id}/ - Delete development goal
GET /api/development/skills/ - List skills
POST /api/development/skills/ - Create skill
GET /api/development/skills/{id}/ - Get skill
GET /api/development/resources/ - List training resources
POST /api/development/resources/ - Create training resource
GET /api/development/resources/{id}/ - Get training resource
PUT /api/development/resources/{id}/ - Update training resource
DELETE /api/development/resources/{id}/ - Delete training resource
GET /api/development/recommendations/ - Get personalized recommendations
```

### 7.2 Frontend Specifications

#### Development Components
```typescript
// components/development/GoalTracker.tsx
interface DevelopmentGoal {
  id: number;
  title: string;
  description: string;
  category: 'skill' | 'career' | 'performance';
  priority: 'low' | 'medium' | 'high';
  status: 'not_started' | 'in_progress' | 'completed' | 'cancelled';
  startDate: string;
  targetDate: string;
  completionDate?: string;
  progress: number;
  skills: GoalSkill[];
}

interface GoalSkill {
  id: number;
  skill: Skill;
  proficiencyLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  targetLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

const GoalTracker: React.FC = () => {
  const [goals, setGoals] = useState<DevelopmentGoal[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<DevelopmentGoal | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const fetchGoals = async () => {
    try {
      const response = await api.get<DevelopmentGoal[]>('/api/development/goals/');
      setGoals(response.data);
    } catch (error) {
      handleError(error);
    }
  };
  
  const createGoal = async (goalData: Partial<DevelopmentGoal>) => {
    try {
      const response = await api.post<DevelopmentGoal>('/api/development/goals/', goalData);
      setGoals([...goals, response.data]);
      setShowCreateModal(false);
    } catch (error) {
      handleError(error);
    }
  };
  
  // Implementation details...
};
```

## 8. Continuous Feedback System

### 8.1 Backend Specifications

#### Models
```python
# feedback/models.py
class Feedback(models.Model):
    THANK_YOU = 'thank_you'
    GOOD_JOB = 'good_job'
    IMPROVEMENT = 'improvement'
    
    FEEDBACK_TYPES = [
        (THANK_YOU, 'Thank You'),
        (GOOD_JOB, 'Good Job'),
        (IMPROVEMENT, 'Improvement Suggestion'),
    ]
    
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='feedback_sent')
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='feedback_received')
    feedback_type = models.CharField(max_length=20, choices=FEEDBACK_TYPES)
    message = models.TextField()
    is_public = models.BooleanField(default=False)  # Visible to manager
    is_anonymous = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class PrivateNote(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='private_notes')
    title = models.CharField(max_length=200)
    content = models.TextField()
    is_pinned = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class RecognitionBadge(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    icon = models.CharField(max_length=50, blank=True)  # Icon class name
    color = models.CharField(max_length=7, default='#007BFF')  # Hex color code
    created_at = models.DateTimeField(auto_now_add=True)

class UserBadge(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='badges')
    badge = models.ForeignKey(RecognitionBadge, on_delete=models.CASCADE)
    awarded_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='awarded_badges')
    message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'badge')
```

#### API Endpoints
```
POST /api/feedback/ - Create feedback
GET /api/feedback/received/ - List received feedback
GET /api/feedback/sent/ - List sent feedback
DELETE /api/feedback/{id}/ - Delete feedback
GET /api/feedback/notes/ - List private notes
POST /api/feedback/notes/ - Create private note
GET /api/feedback/notes/{id}/ - Get private note
PUT /api/feedback/notes/{id}/ - Update private note
DELETE /api/feedback/notes/{id}/ - Delete private note
GET /api/feedback/badges/ - List recognition badges
GET /api/feedback/user-badges/ - List user badges
POST /api/feedback/award-badge/ - Award badge to user
```

### 8.2 Frontend Specifications

#### Feedback Components
```typescript
// components/feedback/FeedbackForm.tsx
interface Feedback {
  id: number;
  sender: User;
  recipient: User;
  feedbackType: 'thank_you' | 'good_job' | 'improvement';
  message: string;
  isPublic: boolean;
  isAnonymous: boolean;
  createdAt: string;
}

const FeedbackForm: React.FC<{ recipientId: number; onSubmit: () => void }> = ({ 
  recipientId, 
  onSubmit 
}) => {
  const [feedbackType, setFeedbackType] = useState<'thank_you' | 'good_job' | 'improvement'>('thank_you');
  const [message, setMessage] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setSubmitting(true);
    try {
      await api.post('/api/feedback/', {
        recipient: recipientId,
        feedback_type: feedbackType,
        message,
        is_public: isPublic,
        is_anonymous: isAnonymous,
      });
      onSubmit();
    } catch (error) {
      handleError(error);
    } finally {
      setSubmitting(false);
    }
  };
  
  // Implementation details...
};
```

## 9. AI & Advanced Analytics

### 9.1 Backend Specifications

#### Models
```python
# analytics/models.py
class PerformancePrediction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    predicted_score = models.FloatField()
    confidence_level = models.FloatField()  # 0.0 to 1.0
    factors = models.JSONField()  # Key factors influencing prediction
    prediction_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

class TalentRiskAssessment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    risk_level = models.CharField(max_length=20, choices=[
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ])
    risk_factors = models.JSONField()  # Identified risk factors
    recommendations = models.JSONField()  # Suggested actions
    assessment_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

class SuccessProfile(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    position = models.CharField(max_length=100)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)
    skills = models.ManyToManyField(Skill, through='ProfileSkill')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class ProfileSkill(models.Model):
    profile = models.ForeignKey(SuccessProfile, on_delete=models.CASCADE)
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)
    importance_level = models.CharField(max_length=20, choices=[
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ])
    
    class Meta:
        unique_together = ('profile', 'skill')

class FeedbackAnalysis(models.Model):
    feedback = models.OneToOneField(Feedback, on_delete=models.CASCADE)
    sentiment_score = models.FloatField()  # -1.0 to 1.0
    bias_detected = models.BooleanField(default=False)
    suggested_improvements = models.JSONField()
    analyzed_at = models.DateTimeField(auto_now_add=True)
```

#### API Endpoints
```
GET /api/analytics/predictions/ - List performance predictions
GET /api/analytics/predictions/{id}/ - Get performance prediction
GET /api/analytics/risk-assessments/ - List talent risk assessments
GET /api/analytics/risk-assessments/{id}/ - Get talent risk assessment
GET /api/analytics/success-profiles/ - List success profiles
POST /api/analytics/success-profiles/ - Create success profile
GET /api/analytics/success-profiles/{id}/ - Get success profile
PUT /api/analytics/success-profiles/{id}/ - Update success profile
DELETE /api/analytics/success-profiles/{id}/ - Delete success profile
POST /api/analytics/feedback-analyze/ - Analyze feedback for bias and quality
```

### 9.2 Frontend Specifications

#### Analytics Components
```typescript
// components/analytics/PredictiveDashboard.tsx
interface PerformancePrediction {
  id: number;
  user: User;
  predictedScore: number;
  confidenceLevel: number;
  factors: Record<string, any>;
  predictionDate: string;
}

interface TalentRiskAssessment {
  id: number;
  user: User;
  riskLevel: 'low' | 'medium' | 'high';
  riskFactors: string[];
  recommendations: string[];
  assessmentDate: string;
}

const PredictiveDashboard: React.FC = () => {
  const [predictions, setPredictions] = useState<PerformancePrediction[]>([]);
  const [riskAssessments, setRiskAssessments] = useState<TalentRiskAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchAnalyticsData();
  }, []);
  
  const fetchAnalyticsData = async () => {
    try {
      const [predictionsRes, riskRes] = await Promise.all([
        api.get<PerformancePrediction[]>('/api/analytics/predictions/'),
        api.get<TalentRiskAssessment[]>('/api/analytics/risk-assessments/'),
      ]);
      
      setPredictions(predictionsRes.data);
      setRiskAssessments(riskRes.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };
  
  // Implementation details...
};
```

## 10. Admin & Super Admin Features

### 10.1 Backend Specifications

#### Models
```python
# admin/models.py
class SystemHealth(models.Model):
    metric_name = models.CharField(max_length=100)
    value = models.FloatField()
    threshold = models.FloatField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=[
        ('normal', 'Normal'),
        ('warning', 'Warning'),
        ('critical', 'Critical'),
    ])
    last_updated = models.DateTimeField(auto_now=True)

class AuditLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    object_id = models.PositiveIntegerField(null=True, blank=True)
    changes = models.JSONField()
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

class BrandingConfig(models.Model):
    company_name = models.CharField(max_length=200)
    logo = models.ImageField(upload_to='branding/', blank=True, null=True)
    primary_color = models.CharField(max_length=7, default='#007BFF')
    secondary_color = models.CharField(max_length=7, default='#6C757D')
    favicon = models.ImageField(upload_to='branding/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

#### API Endpoints
```
GET /api/admin/system-health/ - Get system health metrics
GET /api/admin/audit-logs/ - List audit logs
GET /api/admin/audit-logs/{id}/ - Get audit log
GET /api/admin/users/ - List all users (admin)
POST /api/admin/users/ - Create user (admin)
PUT /api/admin/users/{id}/ - Update user (admin)
DELETE /api/admin/users/{id}/ - Delete user (admin)
GET /api/admin/roles/ - List roles (admin)
POST /api/admin/roles/ - Create role (admin)
PUT /api/admin/roles/{id}/ - Update role (admin)
DELETE /api/admin/roles/{id}/ - Delete role (admin)
GET /api/admin/branding/ - Get branding config
PUT /api/admin/branding/ - Update branding config
GET /api/admin/evaluation-templates/ - List evaluation templates
POST /api/admin/evaluation-templates/ - Create evaluation template
PUT /api/admin/evaluation-templates/{id}/ - Update evaluation template
DELETE /api/admin/evaluation-templates/{id}/ - Delete evaluation template
```

### 10.2 Frontend Specifications

#### Admin Components
```typescript
// components/admin/SystemHealthDashboard.tsx
interface SystemHealthMetric {
  id: number;
  metricName: string;
  value: number;
  threshold?: number;
  status: 'normal' | 'warning' | 'critical';
  lastUpdated: string;
}

const SystemHealthDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemHealthMetric[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchSystemHealth();
  }, []);
  
  const fetchSystemHealth = async () => {
    try {
      const response = await api.get<SystemHealthMetric[]>('/api/admin/system-health/');
      setMetrics(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };
  
  // Implementation details...
};
```

## Technical Architecture

### Frontend Architecture
- **Framework**: React.js with TypeScript
- **State Management**: Redux Toolkit
- **Routing**: React Router
- **UI Components**: Custom component library with Tailwind CSS
- **Data Visualization**: Chart.js and D3.js
- **Forms**: React Hook Form with Yup validation
- **HTTP Client**: Axios with interceptors
- **Internationalization**: react-i18next
- **Testing**: Jest and React Testing Library

### Backend Architecture
- **Framework**: Django with Django REST Framework
- **Database**: PostgreSQL
- **Authentication**: Django REST Framework SimpleJWT
- **Background Tasks**: Celery with Redis
- **Caching**: Redis
- **File Storage**: AWS S3 (production) / Local storage (development)
- **Email**: Django Anymail with SendGrid
- **Real-time**: Django Channels with WebSockets
- **API Documentation**: Swagger/OpenAPI
- **Testing**: PyTest with factory_boy

### Deployment Architecture
- **Containerization**: Docker
- **Orchestration**: Docker Compose (development) / Kubernetes (production)
- **Reverse Proxy**: Nginx
- **SSL**: Let's Encrypt
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **CI/CD**: GitHub Actions

## Security Considerations
- **Authentication**: JWT with refresh tokens
- **Authorization**: Role-based access control (RBAC)
- **Data Encryption**: AES-256 for sensitive data
- **Password Security**: Argon2 hashing
- **Input Validation**: Django forms and serializers validation
- **Rate Limiting**: Django Ratelimit
- **CORS**: Django CORS Headers
- **CSRF Protection**: Django CSRF protection
- **Security Headers**: Django Security Middleware

## Performance Optimization
- **Database**: Indexing, query optimization, connection pooling
- **Caching**: Redis for API responses and session storage
- **Frontend**: Code splitting, lazy loading, memoization
- **Images**: Responsive images with WebP format
- **API**: Pagination, filtering, and field selection
- **Compression**: Gzip compression for API responses
- **CDN**: Content delivery network for static assets

This technical specification document provides a comprehensive guide for implementing all features of the Q360 platform, ensuring alignment with the design requirements while maintaining technical excellence.