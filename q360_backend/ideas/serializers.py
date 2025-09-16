# ideas/serializers.py
from rest_framework import serializers
from .models import Idea, IdeaCategory, IdeaLike, IdeaComment
from accounts.models import User, Department

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class IdeaCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = IdeaCategory
        fields = '__all__'

class IdeaLikeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = IdeaLike
        fields = '__all__'

class IdeaCommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    replies = serializers.SerializerMethodField()
    
    class Meta:
        model = IdeaComment
        fields = '__all__'
    
    def get_replies(self, obj):
        if obj.replies.exists():
            return IdeaCommentSerializer(obj.replies.all(), many=True).data
        return []

class IdeaSerializer(serializers.ModelSerializer):
    submitter = UserSerializer(read_only=True)
    category = IdeaCategorySerializer(read_only=True)
    department = DepartmentSerializer(read_only=True)
    likes = IdeaLikeSerializer(many=True, read_only=True)
    comments = IdeaCommentSerializer(many=True, read_only=True)
    likes_count = serializers.IntegerField(read_only=True)
    comments_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Idea
        fields = '__all__'
    
    def get_comments_count(self, obj):
        return obj.comments.count()