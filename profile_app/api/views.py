from rest_framework.response import Response
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import FormParser, MultiPartParser
from ..models import UserProfile
from django.contrib.auth.models import User
from .serializers import UserProfileSerializer, UserPfpSerializer
from create_post.api.serializers import ImagePostSerializer
from user_authentication.api.serializers import UserSerializer
from create_post.models import ImagePost
from ..models import UserPfp


@api_view(["GET", "POST"])
def profile(request):
    # userprofile is one to one relationship with user, adding extra info to user
    user = User.objects.get(username=request.data['user_name'])
    user_profile = user.userprofile
    serializedProfile = UserProfileSerializer(user_profile)
    followers = list(user_profile.followers.all())
    serialized_followers = UserProfileSerializer(followers, many=True) # followers has a list of UserProfile objects, so need to serialized everything in that
    followers = {'followers': serialized_followers.data}
    all_data = {}
    all_data.update(serializedProfile.data)
    all_data.update(followers)
    return Response({'extraUserData': all_data})


@api_view(["GET", "POST"])
def get_user(request):
    user = User.objects.get(username=request.data['user_name'])
    user_serialized = UserSerializer(user)
    return Response({'user': user_serialized.data})


@api_view(["GET", "POST"])
def get_posts(request):
    user = User.objects.get(username=request.data['user_name'])
    posts = ImagePost.objects.filter(FK_Image_User=user)
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
    # some requests in react have sent a user_name, while some just get it from request.user
    if request.data.get('user_name'):
        specific_user = User.objects.get(username=request.data['user_name'])
        specific_user_pfp = UserPfp.objects.get(FK_User_UserPfp=specific_user)
        specific_user_pfp_serialized = UserPfpSerializer(specific_user_pfp)
        return Response({'userPfp': specific_user_pfp_serialized.data})
    else:
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


@api_view(['GET', 'POST'])
def follow_user(request):
    following_user = User.objects.get(username=request.data['following_user'])
    followed_user = User.objects.get(username=request.data['followed_user'])
    following_user_profile = UserProfile.objects.get(user=following_user)
    followed_user_profile = UserProfile.objects.get(user=followed_user)
    if following_user_profile in followed_user_profile.followers.all():
        following_user_profile.following.remove(followed_user_profile)
    else:
        following_user_profile.following.add(followed_user_profile)
    return Response({'followsubmited': 'true'})


@api_view(['GET', 'POST'])
def get_is_followed(request):
    following_user = User.objects.get(username=request.data['following_user'])
    followed_user = User.objects.get(username=request.data['followed_user'])
    following_user_profile = UserProfile.objects.get(user=following_user)
    followed_user_profile = UserProfile.objects.get(user=followed_user)
    if following_user_profile in followed_user_profile.followers.all():
        return Response({'isFollowed': True})
    else:
        return Response({'isFollowed': False})