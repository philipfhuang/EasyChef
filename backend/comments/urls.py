from django.urls import path

from comments.views import CreateCommentView, DeleteCommentView, GetCommentView

urlpatterns = [
    path('', CreateCommentView.as_view()),
    path('<int:rid>/', GetCommentView.as_view()),
    path('deleteComment/', DeleteCommentView.as_view()),
]
