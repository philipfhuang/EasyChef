from django.urls import path

from comments.views import CommentImageCreateView, CommentImageDeleteView, \
    CommentVideoCreateView, CommentVideoDeleteView, CreateCommentView, \
    DeleteCommentView, GetCommentView

urlpatterns = [
    path('', CreateCommentView.as_view()),
    path('<int:rid>/', GetCommentView.as_view()),
    path('commentDelete/', DeleteCommentView.as_view()),

    path('commentImage/', CommentImageCreateView.as_view()),
    path('commentImageDelete/', CommentImageDeleteView.as_view()),

    path('commentVideo/', CommentVideoCreateView.as_view()),
    path('commentVideoDelete/', CommentVideoDeleteView.as_view()),
]
