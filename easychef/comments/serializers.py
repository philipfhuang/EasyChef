from rest_framework import serializers
from .models import Comment


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('id', 'userid', 'recipeid', 'content', 'rating')

    def create(self, validated_data):
        return Comment.objects.create(
            userid=self.context['request'].user,
            recipeid=validated_data.get('recipeid'),
            content=validated_data.get('content'),
            rating=validated_data.get('rating')
        )


class CommentImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('id', 'image')

    def create(self, validated_data):
        return Comment.objects.create(
            image=validated_data['image']
        )
