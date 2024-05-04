from rest_framework.response import Response
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import FormParser, MultiPartParser
from django.contrib.auth.hashers import check_password
from django.contrib.auth.models import User
from ..models import ImagePost

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