from django.db.models import Avg
from rest_framework import serializers

from recipes.models import Diet, Recipe, Cuisine, Ingredient, \
    IngredientQuantity, RecipeCuisine, RecipeDiet, Step, StepImage, Unit
from accounts.serializers import LessInfoUserSerializer
from comments.serializers import CommentSerializer


class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ('id', 'name')


class IngredientQuantitySerializer(serializers.ModelSerializer):
    ingredient = IngredientSerializer(read_only=True)
    unit = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = IngredientQuantity
        fields = ('id', 'ingredient', 'quantity', 'unit', 'recipe')


class StepImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = StepImage
        fields = ('id', 'step', 'image')


class StepVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = StepImage
        fields = ('id', 'step', 'video')


class StepSerializer(serializers.ModelSerializer):
    images = StepImageSerializer(many=True, read_only=True)
    videos = StepVideoSerializer(many=True, read_only=True)
    recipe = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Step
        fields = ('id', 'step_number', 'content', 'recipe', 'images', 'videos')


class CuisineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cuisine
        fields = ('id', 'name')


class DietSerializer(serializers.ModelSerializer):
    class Meta:
        model = Diet
        fields = ('id', 'name')


class UnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = ('id', 'name')


class RecipeDietSerializer(serializers.ModelSerializer):
    recipe = serializers.PrimaryKeyRelatedField(read_only=True)
    diet = DietSerializer(read_only=True)

    class Meta:
        model = RecipeDiet
        fields = ('recipe', 'diet')


class RecipeCuisineSerializer(serializers.ModelSerializer):
    recipe = serializers.PrimaryKeyRelatedField(read_only=True)
    cuisine = CuisineSerializer(read_only=True)

    class Meta:
        model = RecipeCuisine
        fields = ('recipe', 'cuisine')


class RecipeSerializer(serializers.ModelSerializer):
    creator = LessInfoUserSerializer(read_only=True)
    cuisines = RecipeCuisineSerializer(many=True, read_only=True)
    ingredient_quantities = IngredientQuantitySerializer(many=True,
                                                         read_only=True)
    steps = StepSerializer(many=True, required=True)
    diets = RecipeDietSerializer(many=True, read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    total_likes = serializers.SerializerMethodField('get_total_likes',
                                                    read_only=True)
    avg_rating = serializers.SerializerMethodField('get_avg_rating',
                                                   read_only=True)
    cover = serializers.ImageField(use_url=True, required=False)

    cuisine_data = serializers.ListField(
        child=serializers.CharField(), write_only=True, required=False
    )
    diet_data = serializers.ListField(
        child=serializers.CharField(), write_only=True, required=False
    )
    ingredient_quantities_data = serializers.ListField(
        child=serializers.DictField(), write_only=True, required=True
    )

    class Meta:
        model = Recipe
        fields = (
            'id', 'title', 'cooking_time', 'description', 'created_at',
            'updated_at', 'creator', 'cuisines', 'diets',
            'ingredient_quantities', 'cover', 'steps', 'total_likes',
            'avg_rating', 'comments', 'cuisine_data', 'diet_data',
            'ingredient_quantities_data')

    def create(self, validated_data):
        try:
            cuisine_data = validated_data.pop('cuisine_data')
        except KeyError:
            cuisine_data = []
        try:
            ingredient_data = validated_data.pop('ingredient_quantities_data')
        except KeyError:
            ingredient_data = []
        try:
            diet_data = validated_data.pop('diet_data')
        except KeyError:
            diet_data = []
        step_data = validated_data.pop('steps')

        recipe = Recipe.objects.create(**validated_data)

        for name in cuisine_data:
            try:
                cuisine = Cuisine.objects.get(name=name)
            except Cuisine.DoesNotExist:
                cuisine = Cuisine.objects.create(name=name)
            RecipeCuisine.objects.create(recipe=recipe, cuisine=cuisine)
        for diet in diet_data:
            try:
                diet = Diet.objects.get(name=diet)
            except Diet.DoesNotExist:
                diet = Diet.objects.create(name=diet)
            RecipeDiet.objects.create(recipe=recipe, diet=diet)
        for ingre in ingredient_data:
            try:
                unit = Unit.objects.get(name=ingre['unit'])
                ingredient = Ingredient.objects.get(
                    name=ingre['ingredient'])
            except Unit.DoesNotExist:
                unit = Unit.objects.create(name=ingre['unit'])
            except Ingredient.DoesNotExist:
                ingredient = Ingredient.objects.create(
                    name=ingre['ingredient'])

            IngredientQuantity.objects.create(recipe=recipe,
                                              ingredient=ingredient,
                                              quantity=ingre['quantity'],
                                              unit=unit)
        for step in step_data:
            Step.objects.create(recipe=recipe, **step)

        return recipe

    def get_total_likes(self, obj):
        return obj.likes.count()

    def get_avg_rating(self, obj):
        return obj.comments.all().aggregate(Avg('rating'))['rating__avg']
