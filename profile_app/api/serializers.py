from rest_framework import serializers
from django.contrib.auth.models import User
from ..models import UserProfile
from ..models import UserPfp

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = UserProfile
        fields = '__all__'

class UserPfpSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = UserPfp
        fields = ['user_pfp_url', 'default_pfp']