from rest_framework.response import Response
from rest_framework.decorators import api_view
from ..models import UserProfile
from django.contrib.auth.models import User
from .serializers import UserProfileSerializer

@api_view(["GET", "POST"])
def profile(request):
    user = User.objects.get(id=request.data['userId'])
    serializedProfile = UserProfileSerializer(user.userprofile)
    return Response({'extraUserData': serializedProfile.data})