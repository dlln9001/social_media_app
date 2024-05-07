from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_post),
    path('delete/', views.delete_post),
    path('createcomment/', views.create_comment),
    path('getcomment/', views.get_comment),
    path('deletecomment/', views.delete_comment),
    path('submitlike/', views.submit_like),
    path('getlike/', views.get_like),
]