# Generated by Django 4.1.7 on 2023-04-05 16:59

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('recipes', '0001_initial'),
        ('auth', '0012_alter_user_first_name_max_length'),
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='shoppinglistitem',
            name='item',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='recipes.ingredientquantity'),
        ),
        migrations.AddField(
            model_name='shoppinglistitem',
            name='userid',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='shopping_list', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='like',
            name='recipeid',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='likes', to='recipes.recipe'),
        ),
        migrations.AddField(
            model_name='like',
            name='userid',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='likes', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='favorite',
            name='recipeid',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='favorites', to='recipes.recipe'),
        ),
        migrations.AddField(
            model_name='favorite',
            name='userid',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='favorites', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='user',
            name='groups',
            field=models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups'),
        ),
        migrations.AddField(
            model_name='user',
            name='user_permissions',
            field=models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions'),
        ),
        migrations.AlterUniqueTogether(
            name='shoppinglistitem',
            unique_together={('userid', 'item')},
        ),
        migrations.AlterUniqueTogether(
            name='like',
            unique_together={('userid', 'recipeid')},
        ),
        migrations.AlterUniqueTogether(
            name='favorite',
            unique_together={('userid', 'recipeid')},
        ),
    ]
