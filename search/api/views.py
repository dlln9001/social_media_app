from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from user_authentication.api.serializers import UserSerializer
from profile_app.api.serializers import UserPfpSerializer
from profile_app.models import UserPfp


@api_view(['GET', 'POST'])
def search_user(request):
    if request.data['searchInput'] == '':
        return Response({'response': 'No user found'})
    searched_users = User.objects.filter(username__icontains=request.data['searchInput'])
    Pfps = []
    for x in searched_users:
        user_pfp = UserPfp.objects.get(FK_User_UserPfp=x)
        Pfps.append(user_pfp)
    user_pfps_serialized = UserPfpSerializer(Pfps, many=True)
    searched_users_serialized = UserSerializer(searched_users, many=True)
    if searched_users_serialized:
        return Response({'Users': searched_users_serialized.data, 'Pfps': user_pfps_serialized.data})
    return Response({'response': 'No user found'})