from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

# Create your models here.


class Comment(models.Model):
    userid = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='comments', default=1)
    recipeid = models.ForeignKey('recipes.Recipe', on_delete=models.CASCADE, related_name='comments', blank=False, null=False)
    content = models.TextField(blank=True, null=True)
    rating = models.IntegerField(validators=[MaxValueValidator(5), MinValueValidator(1)])


class CommentImage(models.Model):
    comment = models.ForeignKey('Comment', on_delete=models.CASCADE,
                               related_name='images')
    image = models.ImageField(upload_to='comments/')

    def __str__(self):
        return f'{self.comment} - {self.image}'
