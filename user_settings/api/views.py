from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from profile_app.models import UserProfile


@api_view(['GET', 'POST'])
def edit_profile(request):
    usernames = User.objects.filter(username=request.data['username_text'])
    user = User.objects.get(id=request.user.id)
    user_profile = UserProfile.objects.get(user=user)
    if request.data['username_text'] != user.username:
        if not usernames:
            user.username = request.data['username_text']
        else:
            return Response({'error': 'Username Already Taken'})
    if request.data['name_text']:
        user.first_name = request.data['name_text']
    if request.data['bio_text']:
        user_profile.bio = request.data['bio_text']
    user.save()
    user_profile.save()
    return Response({'name_text': f'{user.first_name}', 'bio_text': f'{user_profile.bio}', 'username_text': f'{user.username}'})