from django.urls import path

from comments.views import CommentImageCreateView, CommentImageDeleteView, \
    CommentListView, CommentVideoCreateView, CommentVideoDeleteView, \
    CreateCommentView, DeleteCommentView, CommentView

urlpatterns = [
    path('', CreateCommentView.as_view()),
    path('<int:id>/', CommentView.as_view()),  # get comment by id
    path('fromRecipe/<int:rid>', CommentListView.as_view()),  # get comments from recipe
    path('commentDelete/', DeleteCommentView.as_view()),

    path('commentImage/', CommentImageCreateView.as_view()),
    path('commentImageDelete/', CommentImageDeleteView.as_view()),

    path('commentVideo/', CommentVideoCreateView.as_view()),
    path('commentVideoDelete/', CommentVideoDeleteView.as_view()),
]
