# accounts/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Department

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'created_at')
    search_fields = ('name',)

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'department', 'manager')
    list_filter = ('role', 'department', 'is_staff', 'is_active')
    fieldsets = UserAdmin.fieldsets + (
        ('Q360 Information', {
            'fields': ('role', 'department', 'manager', 'employee_id', 'hire_date', 'position', 'phone', 'avatar')
        }),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Q360 Information', {
            'fields': ('role', 'department', 'manager', 'employee_id', 'hire_date', 'position', 'phone', 'avatar')
        }),
    )