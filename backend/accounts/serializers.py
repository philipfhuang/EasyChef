from rest_framework import serializers
from accounts.models import Favorite, Like, User


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ('id', 'recipeid')

    def create(self, validated_data):
        userid = self.context['request'].user.id
        user = User.objects.get(id=userid)
        like = Like.objects.create(
            userid=user,
            recipeid=validated_data.get('recipeid')
        )
        return like


class FavorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = ('id', 'recipeid')

    def create(self, validated_data):
        userid = self.context['request'].user.id
        user = User.objects.get(id=userid)
        favorite = Favorite.objects.create(
            userid=user,
            recipeid=validated_data.get('recipeid')
        )
        return favorite


class UserSerializer(serializers.ModelSerializer):
    created_recipes = serializers.PrimaryKeyRelatedField(many=True,
                                                         read_only=True)
    id = serializers.IntegerField(read_only=True)
    password = serializers.CharField(write_only=True, required=True)
    password2 = serializers.CharField(write_only=True, required=True)
    shopping_list = serializers.PrimaryKeyRelatedField(many=True,
                                                       read_only=True)
    commented_recipes = serializers.SerializerMethodField(
        'get_commented_recipes', read_only=True)
    liked_recipes = serializers.SerializerMethodField('get_liked_recipes',
                                                      read_only=True)
    favored_recipes = serializers.SerializerMethodField('get_favored_recipes',
                                                        read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email',
                  'phone_number', 'avatar', 'password', 'password2',
                  'shopping_list', 'created_recipes', 'liked_recipes',
                  'favored_recipes', 'commented_recipes',)

    def validate(self, data):
        if data.get('password') != data.get('password2'):
            raise serializers.ValidationError(
                {'password2': 'Passwords must match.'})
        return data

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data.get('username'),
            first_name=validated_data.get('first_name'),
            last_name=validated_data.get('last_name'),
            email=validated_data.get('email'),
            phone_number=validated_data.get('phone_number'),
            avatar=validated_data.get('avatar'),
            password=validated_data.get('password')
        )
        return user

    def get_commented_recipes(self, obj):
        return obj.comments.values_list('recipeid', flat=True)

    def get_liked_recipes(self, obj):
        return obj.likes.values_list('recipeid', flat=True)

    def get_favored_recipes(self, obj):
        return obj.favorites.values_list('recipeid', flat=True)


class LessInfoUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'avatar')
