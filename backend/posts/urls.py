from django.urls import path
from .views import CuisineCreateView, CuisineListView, DietCreateView, \
    DietListView, DietOneView, IngredientCreateView, \
    IngredientListView, RecipeCuisineCreateView, RecipeCuisineDeleteView, \
    RecipeDeleteView, \
    RecipeDietCreateView, RecipeUpdateView, StepCreateView, \
    StepDeleteView, StepListView, \
    StepUpdateView, \
    UnitCreateView, \
    UnitListView, IngredientQuantityCreateView, IngredientQuantityListView, \
    RecipeCreateView, RecipeListView, IngredientQuantityUpdateView, \
    CuisineOneView, IngredientOneView, UnitOneView, RecipeOneView, \
    IngredientQuantityOneView

urlpatterns = [
    path('diet/', DietCreateView.as_view()),
    path('diets/', DietListView.as_view()),
    path('diet/<int:did>/', DietOneView.as_view()),
    path('cuisine/', CuisineCreateView.as_view()),
    path('cuisines/', CuisineListView.as_view()),
    path('cuisine/<int:cid>/', CuisineOneView.as_view()),
    path('ingredient/', IngredientCreateView.as_view()),
    path('ingredients/', IngredientListView.as_view()),
    path('ingredient/<int:iid>/', IngredientOneView.as_view()),
    path('unit/', UnitCreateView.as_view()),
    path('units/', UnitListView.as_view()),
    path('unit/<int:uid>/', UnitOneView.as_view()),
    path('ingredientQuantity/', IngredientQuantityCreateView.as_view()),
    path('ingredientQuantitys/', IngredientQuantityListView.as_view()),
    path('ingredientQuantity/<int:iqid>/', IngredientQuantityOneView.as_view()),
    path('ingredientQuantityUpdate/<int:pk>/', IngredientQuantityUpdateView.as_view()),
    path('recipe/', RecipeCreateView.as_view()),
    path('recipes/', RecipeListView.as_view()),
    path('recipe/<int:rid>/', RecipeOneView.as_view()),
    path('recipeUpdate/<int:rid>/', RecipeUpdateView.as_view()),
    path('deleteRecipe/', RecipeDeleteView.as_view()),
    path('step/', StepCreateView.as_view()),
    path('steps/', StepListView.as_view()),
    path('stepUpdate/<int:pk>/', StepUpdateView.as_view()),
    path('stepDelete/<int:pk>/', StepDeleteView.as_view()),
    path('addCuisine/', RecipeCuisineCreateView.as_view()),
    path('deleteCuisine/<int:rcid>/', RecipeCuisineDeleteView.as_view()),
    path('addDiet/', RecipeDietCreateView.as_view()),
    path('deleteDiet/<int:rdid>/', RecipeDietCreateView.as_view()),
]
