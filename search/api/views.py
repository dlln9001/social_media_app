from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth.models import User

@api_view(['GET', 'POST'])
def search_user(request):
    if request.data['searchInput'] == '':
        return Response({'response': 'No user found'})
    searched_users = User.objects.filter(username__icontains=request.data['searchInput'])
    if searched_users:
        users = []
        for user in searched_users:
            users.append(user.username)
        return Response({'Users': users})
    return Response({'response': 'No user found'})