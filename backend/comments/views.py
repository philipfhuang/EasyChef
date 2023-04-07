from django.shortcuts import get_object_or_404
from rest_framework.generics import DestroyAPIView, ListAPIView, CreateAPIView, \
    RetrieveAPIView
from rest_framework.permissions import IsAuthenticated

from comments.serializers import CommentImageSerializer, CommentSerializer
from comments.models import Comment, CommentImage, CommentVideo


# Create your views here.
class CreateCommentView(CreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]


class CommentView(RetrieveAPIView):
    serializer_class = CommentSerializer

    def get_object(self):
        return get_object_or_404(Comment, id=self.kwargs.get('id'))


class CommentListView(ListAPIView):
    serializer_class = CommentSerializer

    def get_queryset(self):
        queryset = Comment.objects.filter(recipeid=self.kwargs.get('rid'))
        return queryset


class DeleteCommentView(DestroyAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        id = self.request.data.get('id')
        return get_object_or_404(Comment, id=id, userid=self.request.user)


class CommentImageCreateView(CreateAPIView):
    serializer_class = CommentImageSerializer
    permission_classes = [IsAuthenticated]


class CommentImageDeleteView(DestroyAPIView):
    serializer_class = CommentImageSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        id = self.request.data.get('id')
        return get_object_or_404(CommentImage, id=id, comment__userid=self.request.user)


class CommentVideoCreateView(CreateAPIView):
    serializer_class = CommentImageSerializer
    permission_classes = [IsAuthenticated]


class CommentVideoDeleteView(DestroyAPIView):
    serializer_class = CommentImageSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        id = self.request.data.get('id')
        return get_object_or_404(CommentVideo, id=id, comment__userid=self.request.user)


