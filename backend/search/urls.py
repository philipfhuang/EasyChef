from django.urls import path

from .views import SearchFilterView, SearchView, SearchAidView

urlpatterns = [
    path('aid/', SearchAidView.as_view()),
    path('', SearchView.as_view()),
    path('filter/', SearchFilterView.as_view()),
]
