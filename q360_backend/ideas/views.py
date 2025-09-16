# ideas/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from .models import Idea, IdeaCategory, IdeaLike, IdeaComment
from .serializers import IdeaSerializer, IdeaCategorySerializer, IdeaLikeSerializer, IdeaCommentSerializer

class IdeaCategoryViewSet(viewsets.ModelViewSet):
    queryset = IdeaCategory.objects.all()
    serializer_class = IdeaCategorySerializer
    permission_classes = [IsAuthenticated]

class IdeaViewSet(viewsets.ModelViewSet):
    queryset = Idea.objects.all()
    serializer_class = IdeaSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'department', 'status', 'submitter']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'likes_count', 'views_count']

    def perform_create(self, serializer):
        # Set the submitter to the current user
        serializer.save(submitter=self.request.user)

    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        """Like or unlike an idea"""
        idea = self.get_object()
        like, created = IdeaLike.objects.get_or_create(
            idea=idea,
            user=request.user
        )
        if not created:
            like.delete()
            idea.likes_count -= 1
            message = 'Unliked'
        else:
            idea.likes_count += 1
            message = 'Liked'
        idea.save()
        return Response({'message': message, 'likes_count': idea.likes_count})

    @action(detail=True, methods=['post'])
    def upvote(self, request, pk=None):
        """Upvote an idea (alias for like)"""
        return self.like(request, pk)

    @action(detail=True, methods=['post'])
    def downvote(self, request, pk=None):
        """Downvote an idea (removes like if exists)"""
        idea = self.get_object()
        try:
            like = IdeaLike.objects.get(idea=idea, user=request.user)
            like.delete()
            idea.likes_count -= 1
            idea.save()
            return Response({'message': 'Downvoted', 'likes_count': idea.likes_count})
        except IdeaLike.DoesNotExist:
            return Response({'message': 'Not liked yet', 'likes_count': idea.likes_count})

    @action(detail=True, methods=['get'])
    def comments(self, request, pk=None):
        """Get all comments for an idea"""
        idea = self.get_object()
        comments = idea.comments.filter(parent=None)  # Only top-level comments
        serializer = IdeaCommentSerializer(comments, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def add_comment(self, request, pk=None):
        """Add a comment to an idea"""
        idea = self.get_object()
        content = request.data.get('content', '')
        parent_id = request.data.get('parent_id', None)
        
        if not content:
            return Response({'error': 'Content is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if parent comment exists and belongs to the same idea
        parent = None
        if parent_id:
            try:
                parent = IdeaComment.objects.get(id=parent_id, idea=idea)
            except IdeaComment.DoesNotExist:
                return Response({'error': 'Parent comment not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create the comment
        comment = IdeaComment.objects.create(
            idea=idea,
            author=request.user,
            content=content,
            parent=parent
        )
        
        serializer = IdeaCommentSerializer(comment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class IdeaLikeViewSet(viewsets.ModelViewSet):
    queryset = IdeaLike.objects.all()
    serializer_class = IdeaLikeSerializer
    permission_classes = [IsAuthenticated]

class IdeaCommentViewSet(viewsets.ModelViewSet):
    queryset = IdeaComment.objects.all()
    serializer_class = IdeaCommentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['idea', 'author']