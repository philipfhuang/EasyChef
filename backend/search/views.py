from django.db.models import Avg, Q
from rest_framework.generics import ListAPIView

from accounts.models import User
from comments.models import Comment
from recipes.models import Cuisine, Recipe
from posts.serializers import RecipeSerializer
from search.serializer import SearchSerializer


# Create your views here.
def get_cuisine_id(name):
    try:
        cuisine = Cuisine.objects.get(name=name)
    except Cuisine.DoesNotExist:
        cuisine = None
    if cuisine:
        return cuisine.id


def get_creator_id(name):
    try:
        creator = User.objects.get(username=name)
    except User.DoesNotExist:
        creator = None
    if creator:
        return creator.id


def get_recipe_rating(recipe):
    comments = Comment.objects.filter(recipeid=recipe.id)
    rating = comments.aggregate(Avg('rating'))['rating__avg']
    return rating


class SearchView(ListAPIView):
    serializer_class = RecipeSerializer

    def get_queryset(self):
        search_param = self.request.GET.get('content')
        if search_param is None:
            search_param = ''
        cuisine_id = get_cuisine_id(search_param)
        creator_id = get_creator_id(search_param)
        recipes = Recipe.objects.filter(Q(title__icontains=search_param) |
                                        Q(creator__exact=creator_id) |
                                        Q(cuisine__exact=cuisine_id))
        cooktime = self.request.GET.get('cooktime')
        ingredient = self.request.GET.get('ingredient')
        diet = self.request.GET.get('diet')
        cuisine = self.request.GET.get('cuisine')
        sort = self.request.GET.get('sort')
        if cooktime:
            recipes = recipes.filter(cooking_time__lt=cooktime)
        if ingredient:
            recipes = recipes.filter(
                ingredient_quantities__ingredient__name__contains=ingredient)
        if diet:
            recipes = recipes.filter(diet__exact=diet)
        if cuisine:
            recipes = recipes.filter(cuisine__exact=cuisine)
        if sort:
            recipes = sorted(recipes, key=lambda x: get_recipe_rating(x),
                             reverse=True)
        return recipes


class SearchAidView(ListAPIView):
    serializer_class = SearchSerializer

    def get_queryset(self):
        search_param = self.request.GET.get('content')
        recipes = Recipe.objects.filter(title__startswith=search_param)
        return recipes
