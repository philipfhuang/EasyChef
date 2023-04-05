from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from accounts.views import AddShoppingListItemView, DeleteShoppingListItemView, \
    FavorView, LikeView, ShoppingListView, SignUpView, UnfavorView, UnlikeView, \
    UserUpdateView, \
    UserView, LogoutView

urlpatterns = [
    path('login/', TokenObtainPairView.as_view()),
    path('apil/token/refresh/', TokenRefreshView.as_view()),
    path('signup/', SignUpView.as_view()),
    path('profile/<int:uid>/', UserView.as_view()),
    path('profile/', UserUpdateView.as_view()),
    path('logout/', LogoutView.as_view()),
    path('addShoppingList/', AddShoppingListItemView.as_view()),
    path('shoppinglists/', ShoppingListView.as_view()),
    path('deleteShoppingList/', DeleteShoppingListItemView.as_view()),
    path('like/', LikeView.as_view()),
    path('unlike/', UnlikeView.as_view()),
    path('favor/', FavorView.as_view()),
    path('unfavor/', UnfavorView.as_view()),
]
