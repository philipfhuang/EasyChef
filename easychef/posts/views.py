from recipes.models import Diet, Recipe, Ingredient, IngredientQuantity, \
    Cuisine, RecipeCuisine, RecipeDiet, Step, Unit
from rest_framework.generics import RetrieveAPIView, ListAPIView, CreateAPIView, \
    UpdateAPIView, DestroyAPIView
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from posts.serializers import DietSerializer, RecipeCuisineSerializer, \
    RecipeDietSerializer, RecipeSerializer, \
    CuisineSerializer, \
    IngredientSerializer, IngredientQuantitySerializer, \
    StepSerializer, UnitSerializer


class CuisineCreateView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CuisineSerializer


class CuisineListView(ListAPIView):
    serializer_class = CuisineSerializer

    def get_queryset(self):
        return Cuisine.objects.all()


class CuisineOneView(RetrieveAPIView):
    serializer_class = CuisineSerializer

    def get_object(self):
        return get_object_or_404(Cuisine, id=self.kwargs.get('cid'))


class DietCreateView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = DietSerializer


class DietListView(ListAPIView):
    serializer_class = DietSerializer

    def get_queryset(self):
        return Diet.objects.all()


class DietOneView(RetrieveAPIView):
    serializer_class = DietSerializer

    def get_object(self):
        return get_object_or_404(Diet, id=self.kwargs.get('did'))



class IngredientCreateView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = IngredientSerializer


class IngredientListView(ListAPIView):
    serializer_class = IngredientSerializer

    def get_queryset(self):
        return Ingredient.objects.all()


class IngredientOneView(RetrieveAPIView):
    serializer_class = IngredientSerializer

    def get_object(self):
        return get_object_or_404(Ingredient, id=self.kwargs.get('iid'))


class UnitCreateView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UnitSerializer


class UnitListView(ListAPIView):
    serializer_class = UnitSerializer

    def get_queryset(self):
        return Unit.objects.all()


class UnitOneView(RetrieveAPIView):
    serializer_class = UnitSerializer

    def get_object(self):
        return get_object_or_404(Unit, id=self.kwargs.get('uid'))


class RecipeCreateView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RecipeSerializer


class RecipeListView(ListAPIView):
    serializer_class = RecipeSerializer

    def get_queryset(self):
        return Recipe.objects.all()


class RecipeOneView(RetrieveAPIView):
    serializer_class = RecipeSerializer

    def get_object(self):
        return get_object_or_404(Recipe, id=self.kwargs.get('rid'))


class RecipeUpdateView(UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RecipeSerializer
    queryset = Recipe.objects.all()


class RecipeDeleteView(DestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RecipeSerializer

    def get_object(self):
        id = self.request.data.get('id')
        if id:
            id = id[0]
        return get_object_or_404(Recipe, id=id, creator_id=self.request.user)


class IngredientQuantityCreateView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = IngredientQuantitySerializer


class IngredientQuantityListView(ListAPIView):
    serializer_class = IngredientQuantitySerializer

    def get_queryset(self):
        return IngredientQuantity.objects.all()


class IngredientQuantityOneView(RetrieveAPIView):
    serializer_class = IngredientQuantitySerializer

    def get_object(self):
        return get_object_or_404(IngredientQuantity, id=self.kwargs.get('iqid'))


class IngredientQuantityUpdateView(UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = IngredientQuantitySerializer

    def get_queryset(self):
        return IngredientQuantity.objects.all()


class StepCreateView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = StepSerializer


class StepListView(ListAPIView):
    serializer_class = StepSerializer

    def get_queryset(self):
        return Step.objects.filter(recipe=self.kwargs.get('rid'))


class StepUpdateView(UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = StepSerializer

    def get_queryset(self):
        return Step.objects.all()


class StepDeleteView(DestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = StepSerializer

    def get_queryset(self):
        return Step.objects.all()


class RecipeCuisineCreateView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RecipeCuisineSerializer


class RecipeCuisineDeleteView(DestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RecipeCuisineSerializer

    def get_queryset(self):
        return RecipeCuisine.objects.all()


class RecipeDietCreateView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RecipeDietSerializer


class RecipeDietDeleteView(DestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RecipeDietSerializer

    def get_queryset(self):
        return RecipeDiet.objects.all()
