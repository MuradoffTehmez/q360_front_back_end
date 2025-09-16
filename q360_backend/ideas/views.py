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

    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
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