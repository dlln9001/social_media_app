from rest_framework.response import Response
from rest_framework.decorators import api_view
from ..models import UserProfile
from django.contrib.auth.models import User
from .serializers import UserProfileSerializer
from create_post.api.serializers import ImagePostSerializer
from create_post.models import ImagePost


@api_view(["GET", "POST"])
def profile(request):
    # userprofile is one to one relationship with user, adding extra info to user
    serializedProfile = UserProfileSerializer(request.user.userprofile)
    return Response({'extraUserData': serializedProfile.data})


@api_view(["GET", "POST"])
def get_posts(request):
    posts = ImagePost.objects.filter(FK_Image_User=request.user)
    serialized_posts = ImagePostSerializer(posts, many=True)
    return Response({'postData': serialized_posts.data})