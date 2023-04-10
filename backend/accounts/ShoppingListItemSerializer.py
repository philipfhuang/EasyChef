from rest_framework import serializers
from accounts.models import ShoppingListItem
from posts.serializers import IngredientQuantitySerializer


class ShoppingListItemSerializer(serializers.ModelSerializer):
    ingredients = serializers.SerializerMethodField('get_ingredients',
                                                    read_only=True)
    userid = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = ShoppingListItem
        fields = ('id', 'item', 'userid', 'ingredients')

    def create(self, validated_data):
        userid = self.context['request'].user
        item = ShoppingListItem.objects.create(
            userid=userid,
            item=validated_data.get('item')
        )
        return item

    def get_ingredients(self, obj):
        return IngredientQuantitySerializer(obj.item).data
