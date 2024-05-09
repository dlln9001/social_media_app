from rest_framework import serializers
from ..models import ImagePost
from ..models import Comment

class ImagePostSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='FK_Image_User.username', read_only=True)
    class Meta(object):
        model = ImagePost
        fields = ['image', 'aspect_ratio', 'date_created', 'username']

class CommentSerializer(serializers.ModelSerializer):
    class Meta(object):
        model=Comment
        fields=['text', 'date_created', 'id']