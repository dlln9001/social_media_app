from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from .serializers import UserSerializer
from profile_app.models import UserProfile, UserPfp


# tests connection
@api_view(['GET'])
def getData(request):
    person = {'name': 'Test', 'age': 30}
    return Response(person)


@api_view(['POST'])
def signup(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid(): 
        serializer.save()
        user = User.objects.get(username=request.data['username'])
        # store a hashed password
        user.set_password(request.data['password'])
        user.save()
        token = Token.objects.create(user=user)
        # Makes the user profile
        userProfile = UserProfile(user=user)
        userProfile.save()
        # make default profile picture
        user_pfp = UserPfp(FK_User_UserPfp=user)
        user_pfp.save()
        return Response({'token': token.key, 'user': serializer.data, 'detail': 'good'})
    return Response({'username': 'A user with that username already exists.'})


@api_view(['POST'])
def login(request):
    user = get_object_or_404(User, username=request.data['username'])
    if not user.check_password(request.data['password']):
        return Response({'detail': 'not found'}, status=status.HTTP_400_BAD_REQUEST)
    Token.objects.filter(user=user).delete() # deletes old token if it exists
    token = Token.objects.create(user=user) # creates new token
    serializer = UserSerializer(instance=user)
    return Response({'token': token.key, 'user': serializer.data, 'detail': 'good'})


from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def test_token(request):
    return Response({'message': 'Token is valid!'})