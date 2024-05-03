from django.urls import path
from . import views

urlpatterns = [
    path('', views.profile),
    path('posts/', views.get_posts),
]