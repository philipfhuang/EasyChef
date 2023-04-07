from django.shortcuts import get_object_or_404
from rest_framework.generics import DestroyAPIView, ListAPIView, CreateAPIView
from rest_framework.permissions import IsAuthenticated

from comments.serializers import CommentImageSerializer, CommentSerializer
from comments.models import Comment, CommentImage, CommentVideo


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


class ComentListView(ListAPIView):
    serializer_class = CommentSerializer

    def get_queryset(self):
        queryset = Comment.objects.filter(recipeid=self.request.data.get('recipeid'))
        return queryset


class DeleteCommentView(DestroyAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        id = self.request.data.get('id')
        if id:
            id = id[0]
        return get_object_or_404(Comment, id=id, userid=self.request.user)


class CommentImageCreateView(CreateAPIView):
    serializer_class = CommentImageSerializer
    permission_classes = [IsAuthenticated]


class CommentImageDeleteView(DestroyAPIView):
    serializer_class = CommentImageSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        id = self.request.data.get('id')
        if id:
            id = id[0]
        return get_object_or_404(CommentImage, id=id, comment__userid=self.request.user)


class CommentVideoCreateView(CreateAPIView):
    serializer_class = CommentImageSerializer
    permission_classes = [IsAuthenticated]


class CommentVideoDeleteView(DestroyAPIView):
    serializer_class = CommentImageSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        id = self.request.data.get('id')
        if id:
            id = id[0]
        return get_object_or_404(CommentVideo, id=id, comment__userid=self.request.user)


