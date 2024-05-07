from django.urls import path
from . import views

urlpatterns = [
    path('', views.profile),
    path('posts/', views.get_posts),
    path('uploadpfp/', views.upload_pfp),
    path('getpfp/', views.get_pfp),
    path('removepfp/', views.remove_pfp),
    path('getuser/', views.get_user),
]