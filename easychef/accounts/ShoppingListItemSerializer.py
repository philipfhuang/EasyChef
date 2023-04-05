from rest_framework import serializers
from accounts.models import ShoppingListItem
from posts.serializers import IngredientQuantitySerializer


class ShoppingListItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShoppingListItem
        fields = ('id', 'item', 'userid')

    def create(self, validated_data):
        userid = self.context['request'].user
        item = ShoppingListItem.objects.create(
            userid=userid,
            item=validated_data.get('item')
        )
        return item
