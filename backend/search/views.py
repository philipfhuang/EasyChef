from django.db.models import Avg, Q
from django.http import JsonResponse
from django.views import View
from rest_framework.generics import ListAPIView

from comments.models import Comment
from recipes.models import Cuisine, Diet, Ingredient, Recipe
from posts.serializers import RecipeSerializer


# Create your views here.
def get_recipe_rating(recipe):
    comments = Comment.objects.filter(recipeid=recipe.id)
    rating = comments.aggregate(Avg('rating'))['rating__avg']
    if rating is None:
        rating = 0
    return rating


class SearchView(ListAPIView):
    serializer_class = RecipeSerializer

    def get_queryset(self):
        search_param = self.request.GET.get('content')
        if search_param is None:
            search_param = ''
        recipes = Recipe.objects.filter(Q(title__icontains=search_param) |
                                        Q(creator__username__icontains=search_param) |
                                        Q(cuisines__cuisine__name__icontains=search_param))
        cooktime = self.request.GET.get('cooktime')
        ingredient = self.request.GET.get('ingredient')
        diet = self.request.GET.get('diet')
        cuisines = self.request.GET.get('cuisine')
        sort = self.request.GET.get('sort')
        if cooktime:
            recipes = recipes.filter(cooking_time__lte=cooktime)
        if ingredient:
            ingredient = ingredient.split(',')
            recipes = recipes.filter(
                ingredient_quantities__ingredient__name__in=ingredient)
        if diet:
            diet = diet.split(',')
            recipes = recipes.filter(diets__diet__name__in=diet)
        if cuisines:
            cuisines = cuisines.split(',')
            recipes = recipes.filter(cuisines__cuisine__name__in=cuisines)
        if sort:
            recipes = sorted(recipes, key=lambda x: get_recipe_rating(x),
                             reverse=True)
        return recipes


class SearchAidView(View):

    def get(self, request):
        search_param = self.request.GET.get('content')
        data = {
            'results': []
        }
        recipes = Recipe.objects.filter(title__startswith=search_param)
        cuisines = Cuisine.objects.filter(name__startswith=search_param)
        ingredients = Ingredient.objects.filter(name__startswith=search_param)
        diets = Diet.objects.filter(name__startswith=search_param)
        for recipe in recipes:
            data['results'].append(recipe.title)
        for cuisine in cuisines:
            data['results'].append(cuisine.name)
        for ingredient in ingredients:
            data['results'].append(ingredient.name)
        for diet in diets:
            data['results'].append(diet.name)

        data['results'] = data['results'][:5]

        print(data['results'])

        return JsonResponse(data)
