from rest_framework.response import Response
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import FormParser, MultiPartParser
from ..models import UserProfile
from django.contrib.auth.models import User
from .serializers import UserProfileSerializer, UserPfpSerializer
from create_post.api.serializers import ImagePostSerializer
from create_post.models import ImagePost
from ..models import UserPfp


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


@api_view(["GET", "POST"])
@parser_classes([FormParser, MultiPartParser])
def upload_pfp(request):
    pfpFile = request.FILES.get('pfp_file')
    newPfp, created = UserPfp.objects.get_or_create(FK_User_UserPfp=request.user)
    newPfp.user_pfp_url = pfpFile
    newPfp.default_pfp = False
    newPfp.save()
    return Response({'response': 'pfp changed'})


@api_view(["GET", "POST"])
def get_pfp(request):
    user_pfp = UserPfp.objects.get(FK_User_UserPfp=request.user)
    user_pfp_serialized = UserPfpSerializer(user_pfp)
    return Response({'userPfp': user_pfp_serialized.data})


@api_view(["GET", "POST"])
def remove_pfp(request):
    user_pfp = UserPfp.objects.get(FK_User_UserPfp=request.user)
    user_pfp.default_pfp = True
    user_pfp.user_pfp_url = None
    user_pfp.save()
    user_pfp_serialized = UserPfpSerializer(user_pfp)
    return Response({'userPfp': user_pfp_serialized.data})