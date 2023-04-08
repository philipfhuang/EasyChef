from django.core.validators import FileExtensionValidator
from django.db import models


# Create your models here.
class Recipe(models.Model):
    title = models.CharField(max_length=100)
    cooking_time = models.PositiveIntegerField(default=10)
    description = models.TextField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    creator = models.ForeignKey('accounts.User', on_delete=models.CASCADE,
                                related_name='created_recipes', default=1)
    cover = models.ImageField(upload_to='recipes/', blank=True, null=True)

    def __str__(self):
        return self.title


class Step(models.Model):
    recipe = models.ForeignKey('Recipe', on_delete=models.CASCADE,
                               related_name='steps')
    step_number = models.PositiveIntegerField()
    content = models.TextField()

    class Meta:
        unique_together = ('recipe', 'step_number')

    def __str__(self):
        return f'{self.recipe} - {self.step_number}'


class StepImage(models.Model):
    step = models.ForeignKey('Step', on_delete=models.CASCADE,
                             related_name='images')
    image = models.ImageField(upload_to='recipes/images/')

    def __str__(self):
        return f'{self.step} - {self.image}'


class StepVideo(models.Model):
    step = models.ForeignKey('Step', on_delete=models.CASCADE,
                             related_name='videos')
    video = models.FileField(upload_to='recipes/videos/')
    validators = [FileExtensionValidator(allowed_extensions=['MOV','avi','mp4','webm','mkv'])]

    def __str__(self):
        return f'{self.step} - {self.video}'


class Cuisine(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class RecipeCuisine(models.Model):
    recipe = models.ForeignKey('Recipe', on_delete=models.CASCADE,
                               related_name='cuisines')
    cuisine = models.ForeignKey('Cuisine', on_delete=models.CASCADE,
                                related_name='recipes')

    class Meta:
        unique_together = ('recipe', 'cuisine')

    def __str__(self):
        return f'{self.recipe} - {self.cuisine}'


class Diet(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class RecipeDiet(models.Model):
    recipe = models.ForeignKey('Recipe', on_delete=models.CASCADE,
                               related_name='diets')
    diet = models.ForeignKey('Diet', on_delete=models.CASCADE,
                             related_name='recipes')

    class Meta:
        unique_together = ('recipe', 'diet')

    def __str__(self):
        return f'{self.recipe} - {self.diet}'


class Ingredient(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class IngredientQuantity(models.Model):
    ingredient = models.ForeignKey('Ingredient', on_delete=models.CASCADE,
                                   related_name='ingredient_quantities')
    recipe = models.ForeignKey('Recipe', on_delete=models.CASCADE,
                               related_name='ingredient_quantities')
    quantity = models.PositiveIntegerField()
    unit = models.ForeignKey('Unit', on_delete=models.CASCADE,
                             related_name='ingredient_quantities', default=1)

    class Meta:
        unique_together = ('recipe', 'ingredient')

    def __str__(self):
        return f'{self.ingredient} - {self.quantity} {self.unit}'


class Unit(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name
