from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import SearchView, SearchAidView

urlpatterns = [
    path('aid/', SearchAidView.as_view()),
    path('', SearchView.as_view()),
]
