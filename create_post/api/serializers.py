from rest_framework import serializers
from ..models import ImagePost
from ..models import Comment

class ImagePostSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = ImagePost
        fields = ['image', 'aspect_ratio', 'date_created']

class CommentSerializer(serializers.ModelSerializer):
    class Meta(object):
        model=Comment
        fields=['text', 'date_created', 'id']