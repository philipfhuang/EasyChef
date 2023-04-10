from django.urls import path
from .views import CuisineCreateView, CuisineListView, DietCreateView, \
    DietListView, DietOneView, IngredientCreateView, IngredientListView, \
    IngredientQuantityDeleteView, RecipeCuisineCreateView, \
    RecipeCuisineDeleteView, RecipeDeleteView, \
    RecipeDietCreateView, RecipeDietDeleteView, RecipeUpdateView, \
    StepCreateView, StepDeleteView, \
    StepImageCreateView, StepImageDeleteView, StepUpdateView, \
    StepVideoCreateView, StepVideoDeleteView, UnitCreateView, \
    UnitListView, IngredientQuantityCreateView, IngredientQuantityListView, \
    RecipeCreateView, RecipeListView, IngredientQuantityUpdateView, \
    CuisineOneView, IngredientOneView, UnitOneView, RecipeOneView, \
    IngredientQuantityOneView

urlpatterns = [
    path('diet/', DietCreateView.as_view()),  # you can create it through create recipe
    path('diets/', DietListView.as_view()),
    path('diet/<int:did>/', DietOneView.as_view()),

    path('cuisine/', CuisineCreateView.as_view()),  # you can create it through create recipe
    path('cuisines/', CuisineListView.as_view()),
    path('cuisine/<int:cid>/', CuisineOneView.as_view()),

    path('ingredient/', IngredientCreateView.as_view()),  # you can create it through create recipe
    path('ingredients/', IngredientListView.as_view()),
    path('ingredient/<int:iid>/', IngredientOneView.as_view()),

    path('unit/', UnitCreateView.as_view()),
    path('units/', UnitListView.as_view()),
    path('unit/<int:uid>/', UnitOneView.as_view()),

    path('ingredientQuantity/', IngredientQuantityCreateView.as_view()),  # you can create it through create recipe
    path('ingredientQuantitys/', IngredientQuantityListView.as_view()),
    path('ingredientQuantity/<int:iqid>/', IngredientQuantityOneView.as_view()),
    path('ingredientQuantityUpdate/', IngredientQuantityUpdateView.as_view()),
    path('ingredientQuantityDelete/', IngredientQuantityDeleteView.as_view()),

    path('recipe/', RecipeCreateView.as_view()),
    path('recipes/', RecipeListView.as_view()),
    path('recipe/<int:rid>/', RecipeOneView.as_view()),
    path('recipeUpdate/', RecipeUpdateView.as_view()),
    path('deleteRecipe/', RecipeDeleteView.as_view()),

    path('step/', StepCreateView.as_view()),  # you can create it through create recipe
    path('stepUpdate/', StepUpdateView.as_view()),
    path('stepDelete/', StepDeleteView.as_view()),

    path('stepImage/', StepImageCreateView.as_view()),
    path('stepImageDelete/', StepImageDeleteView.as_view()),
    path('stepVideo/', StepVideoCreateView.as_view()),
    path('stepVideoDelete/', StepVideoDeleteView.as_view()),

    path('recipeCuisine/', RecipeCuisineCreateView.as_view()),
    path('recipeCuisineDelete/', RecipeCuisineDeleteView.as_view()),

    path('recipeDiet/', RecipeDietCreateView.as_view()),
    path('recipeDietDelete/', RecipeDietDeleteView.as_view()),
]
