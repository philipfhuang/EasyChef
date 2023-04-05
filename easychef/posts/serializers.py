from django.db.models import Avg
from rest_framework import serializers

from recipes.models import Diet, Recipe, Cuisine, Ingredient, \
    IngredientQuantity, RecipeCuisine, RecipeDiet, Step, Unit
from accounts.serializers import LessInfoUserSerializer
from comments.serializers import CommentSerializer


class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ('id', 'name')


class IngredientQuantitySerializer(serializers.ModelSerializer):
    class Meta:
        model = IngredientQuantity
        fields = ('id', 'ingredient', 'quantity', 'unit', 'recipe')


class StepSerializer(serializers.ModelSerializer):
    recipe = serializers.IntegerField(write_only=True)

    class Meta:
        model = Step
        fields = ('id', 'step_number', 'content', 'recipe')

    def create(self, validated_data):
        print(validated_data)
        recipeid = validated_data.get('recipe')
        recipe = Recipe.objects.get(id=recipeid)
        return Step.objects.create(
            step_number=validated_data.get('step_number'),
            content=validated_data.get('content'),
            recipe=recipe)


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
    class Meta:
        model = RecipeDiet
        fields = ('recipe', 'diet')


class RecipeCuisineSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeCuisine
        fields = ('recipe', 'cuisine')


class RecipeSerializer(serializers.ModelSerializer):
    creator = LessInfoUserSerializer(required=False)
    cuisine = RecipeCuisineSerializer(many=True, read_only=True)
    ingredient_quantities = IngredientQuantitySerializer(many=True,
                                                         required=False)
    steps = StepSerializer(many=True, read_only=True)
    diets = RecipeDietSerializer(many=True, read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    total_likes = serializers.SerializerMethodField('get_total_likes',
                                                    read_only=True)
    avg_rating = serializers.SerializerMethodField('get_avg_rating',
                                                   read_only=True)

    class Meta:
        model = Recipe
        fields = (
            'id', 'title', 'cooking_time', 'description', 'created_at',
            'updated_at', 'creator', 'cuisine', 'diets',
            'ingredient_quantities', 'cover', 'steps', 'total_likes',
            'avg_rating', 'comments')

    def get_total_likes(self, obj):
        return obj.likes.count()

    def get_avg_rating(self, obj):
        return obj.comments.all().aggregate(Avg('rating'))['rating__avg']
