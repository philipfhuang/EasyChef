from rest_framework import serializers

from recipes.models import Recipe


class SearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = ('title',)
