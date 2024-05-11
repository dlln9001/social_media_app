from rest_framework.response import Response
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import FormParser, MultiPartParser
from django.contrib.auth.hashers import check_password
from django.contrib.auth.models import User
from .serializers import CommentSerializer
from user_authentication.api.serializers import UserSerializer
from profile_app.api.serializers import UserPfpSerializer
from profile_app.api.serializers import UserProfileSerializer
from profile_app.models import UserPfp
from profile_app.models import UserProfile
from ..models import ImagePost
from ..models import Comment
from ..models import Like

# Note: though the app is called 'create_post', it does more than just create, it handles interactions with posts as a whole

@api_view(["GET", "POST"])
@parser_classes([FormParser, MultiPartParser])
def create_post(request):
    image_file = request.FILES.get('image')
    aspect_ratio_setting = request.POST.get('aspect_ratio')
    newPost = ImagePost(aspect_ratio=aspect_ratio_setting, FK_Image_User=request.user, image=image_file)
    newPost.save()
    return Response({'response': 'ImageSaved'})


@api_view(["GET", "POST"])
def delete_post(request):
    selected_post = ImagePost.objects.get(FK_Image_User=request.user, image=request.data['post_url'])
    selected_post.delete()
    return Response({'response': 'ImageDeleted'})


@api_view(["GET", "POST"])
def create_comment(request):
    post_commented = ImagePost.objects.get(image=request.data['post_commented'])
    text = request.data['comment_text']
    new_comment = Comment(FK_Comment_User=request.user, FK_Comment_ImagePost=post_commented, text=text)
    new_comment.save()
    return Response({'Commentcreated': 'true'})


@api_view(["GET", "POST"])
def get_comment(request):
    selected_post = ImagePost.objects.get(image=request.data['selected_post'])
    comments = Comment.objects.filter(FK_Comment_ImagePost=selected_post)
    serialized_comments = CommentSerializer(comments, many=True)
    # want to send the commenters information to the front
    users = []
    userPfps = []
    if comments:
        for x in comments:
            user = x.FK_Comment_User
            userPfp = UserPfp.objects.get(FK_User_UserPfp=user)
            user_serialized = UserSerializer(user)
            userPfp_serialized = UserPfpSerializer(userPfp)
            users.append(user_serialized.data)
            userPfps.append(userPfp_serialized.data)
    return Response({'comments': serialized_comments.data, 'users': users, 'userPfps': userPfps})


@api_view(["GET", "POST"])
def delete_comment(request):
    comment = Comment.objects.get(FK_Comment_User=request.user, id=request.data['comment_id'])
    comment.delete()
    return Response({'CommentDeleted': 'true'})


# likes for posts
@api_view(["GET", "POST"])
def submit_like(request):
    post_selected = ImagePost.objects.get(image=request.data['post_selected'])
    # check if a like already exists, if it does, unlike it, if it doesn't, like it
    check_like = Like.objects.filter(FK_Like_Post=post_selected, FK_Like_User=request.user)
    if check_like:
        check_like.delete()
    else:
        like = Like(FK_Like_User=request.user, FK_Like_Post=post_selected)
        like.save()
    return Response({'like_submit': 'true'})


@api_view(["GET", "POST"])
def get_like(request):
    post_selected = ImagePost.objects.get(image=request.data['post_selected'])
    like = Like.objects.filter(FK_Like_Post=post_selected, FK_Like_User=request.user)
    all_likes = Like.objects.filter(FK_Like_Post=post_selected)
    users_liked = []
    for x in all_likes:
        user_data = {}
        user = x.FK_Like_User
        user_pfp = UserPfp.objects.get(FK_User_UserPfp=user)
        user_profile = UserProfile.objects.get(user=user)
        user_data.update(UserSerializer(user).data)
        user_data.update(UserPfpSerializer(user_pfp).data)
        user_data.update(UserProfileSerializer(user_profile).data)
        users_liked.append(user_data)
    num_of_likes = str(len(all_likes))
    if like:
        return Response({'liked': 'true', 'num_of_likes': num_of_likes, 'liker_data': users_liked})
    else:
        return Response({'liked': 'false', 'num_of_likes': num_of_likes, 'liker_data': users_liked})