from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from create_post.models import ImagePost
from create_post.api.serializers import ImagePostSerializer


@api_view(["GET", "POST"])
def get_home_posts(request):
    # gets users, that the signed in user is following
    ids = []
    for x in request.data['following']:
        ids.append(x['id'])
    following = User.objects.filter(id__in=ids)
    all_posts = ImagePost.objects.filter(FK_Image_User__in=following).order_by('-date_created')
    all_posts_serialized = ImagePostSerializer(all_posts, many=True)
    return Response({'allPosts': all_posts_serialized.data})    