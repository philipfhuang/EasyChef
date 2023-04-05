from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.
class User(AbstractUser):
    first_name = models.CharField(max_length=100, blank=False)
    last_name = models.CharField(max_length=100, blank=False)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)


class ShoppingListItem(models.Model):
    userid = models.ForeignKey('User', on_delete=models.CASCADE,
                               related_name='shopping_list', blank=False)
    item = models.ForeignKey('recipes.IngredientQuantity',
                             on_delete=models.CASCADE, blank=False)

    class Meta:
        unique_together = ('userid', 'item')


class Like(models.Model):
    userid = models.ForeignKey('User', on_delete=models.CASCADE,
                               related_name='likes')
    recipeid = models.ForeignKey('recipes.Recipe', on_delete=models.CASCADE,
                                 related_name='likes')

    class Meta:
        unique_together = ('userid', 'recipeid')


class Favorite(models.Model):
    userid = models.ForeignKey('User', on_delete=models.CASCADE,
                               related_name='favorites')
    recipeid = models.ForeignKey('recipes.Recipe', on_delete=models.CASCADE,
                                 related_name='favorites')

    class Meta:
        unique_together = ('userid', 'recipeid')
