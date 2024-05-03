from rest_framework import serializers
from ..models import ImagePost


class ImagePostSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = ImagePost
        fields = ['image', 'aspect_ratio']