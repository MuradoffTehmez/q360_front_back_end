# accounts/permissions.py
from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    """
    Custom permission to only allow admin users to access the view.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_admin

class IsManager(permissions.BasePermission):
    """
    Custom permission to only allow managers to access the view.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_manager

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the object.
        return obj == request.user

class IsManagerOfEmployee(permissions.BasePermission):
    """
    Custom permission to only allow managers to access their team members' data.
    """
    def has_object_permission(self, request, view, obj):
        # Check if the user is a manager and the object (employee) is in their team
        if request.user.is_manager:
            # Assuming obj is an employee/user object
            return obj.manager == request.user
        return False