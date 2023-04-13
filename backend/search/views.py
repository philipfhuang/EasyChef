from django.db.models import Avg, Q
from django.http import JsonResponse
from django.views import View
from rest_framework.generics import ListAPIView

from comments.models import Comment
from recipes.models import Cuisine, Diet, Ingredient, Recipe, Unit
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
        if search_param is not None:
            recipes = Recipe.objects.filter(Q(title__icontains=search_param) |
                                        Q(creator__username__icontains=search_param) |
                                        Q(cuisines__cuisine__name__icontains=search_param))
        else:
            recipes = Recipe.objects.all()
        print(recipes)
        cooktime = self.request.GET.get('cooktime')
        ingredients = self.request.GET.get('ingredient')
        diets = self.request.GET.get('diet')
        cuisines = self.request.GET.get('cuisine')
        sort = self.request.GET.get('sort')
        if cooktime:
            recipes = recipes.filter(cooking_time__lte=int(cooktime))
        if ingredients:
            ingredients = ingredients.split(',')
            recipes = recipes.filter(
                ingredient_quantities__ingredient__name__in=ingredients)
        if diets:
            diets = diets.split(',')
            recipes = recipes.filter(diets__diet__name__in=diets)
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

        data['results'] = list(set(data['results']))
        data['results'] = data['results'][:5]
        return JsonResponse(data)


class SearchFilterView(View):

    def get(self, request):
        search_param = self.request.GET.get('content')
        search_type = self.request.GET.get('type')
        data = {
            'results': []
        }
        if search_type == 'cuisine':
            cuisines = Cuisine.objects.filter(name__startswith=search_param)
            for cuisine in cuisines:
                result = {
                    'value': cuisine.name,
                    'label': cuisine.name,
                    'type': cuisine.id
                }
                data['results'].append(result)
        elif search_type == 'diet':
            diets = Diet.objects.filter(name__startswith=search_param)
            for diet in diets:
                result = {
                    'value': diet.name,
                    'label': diet.name,
                    'type': diet.id
                }
                data['results'].append(result)
        elif search_type == 'ingredient':
            ingredients = Ingredient.objects.filter(name__startswith=search_param)
            for ingredient in ingredients:
                result = {
                    'value': ingredient.name,
                    'label': ingredient.name,
                    'type': ingredient.id
                }
                data['results'].append(result)
        elif search_type == 'unit':
            units = Unit.objects.filter(name__startswith=search_param)
            for unit in units:
                result = {
                    'value': unit.name,
                    'label': unit.name,
                    'type': unit.id
                }
                data['results'].append(result)

        data['results'] = data['results'][:5]

        return JsonResponse(data)
