from rest_framework import serializers
from django.contrib.auth.models import User
from ..models import UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = UserProfile
        fields = '__all__'