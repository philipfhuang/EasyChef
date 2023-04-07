from rest_framework import serializers

from accounts.serializers import LessInfoUserSerializer
from .models import Comment, CommentImage, CommentVideo


class CommentSerializer(serializers.ModelSerializer):
    images = serializers.ImageField(source='images.image', read_only=True, many=True)
    videos = serializers.FileField(source='videos.video', read_only=True, many=True)
    user = LessInfoUserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ('id', 'recipeid', 'content', 'rating', 'images', 'videos', 'user')

    def create(self, validated_data):
        return Comment.objects.create(
            userid=self.context['request'].user,
            recipeid=validated_data.get('recipeid'),
            content=validated_data.get('content'),
            rating=validated_data.get('rating')
        )


class CommentImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentImage
        fields = ('id', 'image')


class CommentVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentVideo
        fields = ('id', 'video')
