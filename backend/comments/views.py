from django.shortcuts import get_object_or_404
from rest_framework.generics import DestroyAPIView, ListAPIView, CreateAPIView
from rest_framework.permissions import IsAuthenticated

from comments.serializers import CommentSerializer
from comments.models import Comment


# Create your views here.
class CreateCommentView(CreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]


class GetCommentView(ListAPIView):
    serializer_class = CommentSerializer

    def get_queryset(self):
        rid = self.kwargs.get('rid')
        queryset = Comment.objects.filter(recipeid=rid)
        return queryset


class DeleteCommentView(DestroyAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        id = self.request.data.get('id')
        if id:
            id = id[0]
        return get_object_or_404(Comment, id=id, userid=self.request.user)
