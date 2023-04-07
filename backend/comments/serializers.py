from rest_framework import serializers

from accounts.serializers import LessInfoUserSerializer
from .models import Comment, CommentImage, CommentVideo


class CommentImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentImage
        fields = ('id', 'image')


class CommentVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentVideo
        fields = ('id', 'video')


class CommentSerializer(serializers.ModelSerializer):
    images = CommentImageSerializer(many=True, read_only=True)
    videos = CommentVideoSerializer(many=True, read_only=True)
    userid = LessInfoUserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ('id', 'recipeid', 'content', 'rating', 'images', 'videos', 'userid')

    def create(self, validated_data):
        return Comment.objects.create(
            userid=self.context['request'].user,
            recipeid=validated_data.get('recipeid'),
            content=validated_data.get('content'),
            rating=validated_data.get('rating')
        )
