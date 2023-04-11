from django.db.models import Q
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.views import View
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import ListAPIView, RetrieveAPIView, CreateAPIView, \
    UpdateAPIView, DestroyAPIView
from rest_framework.permissions import IsAuthenticated

from accounts.serializers import FavorSerializer, LikeSerializer, UserSerializer
from accounts.models import Favorite, Like, ShoppingListItem, User
from accounts.ShoppingListItemSerializer import ShoppingListItemSerializer
from posts.serializers import SimpleRecipeSerializer
from recipes.models import Recipe


# Create your views here.
class SignUpView(CreateAPIView):
    serializer_class = UserSerializer


class UserView(RetrieveAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        return get_object_or_404(User, id=self.kwargs.get('uid'))


class UserUpdateView(UpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class LogoutView(UpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class LikeView(CreateAPIView):
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticated]


class UnlikeView(DestroyAPIView):
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        recipeid = self.request.data.get('recipeid')
        return get_object_or_404(Like, recipeid=recipeid, userid=self.request.user)


class FavorView(CreateAPIView):
    serializer_class = FavorSerializer
    permission_classes = [IsAuthenticated]


class UnfavorView(DestroyAPIView):
    serializer_class = FavorSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        recipeid = self.request.data.get('recipeid')
        return get_object_or_404(Favorite, recipeid=recipeid, userid=self.request.user)


class AddShoppingListItemView(CreateAPIView):
    serializer_class = ShoppingListItemSerializer
    permission_classes = [IsAuthenticated]


class ShoppingListView(ListAPIView):
    serializer_class = ShoppingListItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ShoppingListItem.objects.filter(userid=self.request.user)


class DeleteShoppingListItemView(DestroyAPIView):
    serializer_class = ShoppingListItemSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        id = self.request.data.get('id')
        if id:
            id = id[0]
        return get_object_or_404(ShoppingListItem, id=id, userid=self.request.user)

class CreatedRecipeListView(ListAPIView):
    serializer_class = SimpleRecipeSerializer

    def get_queryset(self):
        user = self.kwargs.get('uid')
        return Recipe.objects.filter(creator=user)

class FavouriteRecipeListView(ListAPIView):
    serializer_class = SimpleRecipeSerializer

    def get_queryset(self):
        user = self.kwargs.get('uid')
        print(user)
        return Recipe.objects.filter(favorites__userid=user)

class InteractedRecipeListView(ListAPIView):
    serializer_class = SimpleRecipeSerializer

    def get_queryset(self):
        user = self.kwargs.get('uid')
        return Recipe.objects.filter(Q(likes__userid=user) |
                                     Q(creator=user) |
                                     Q(comments__userid=user))
