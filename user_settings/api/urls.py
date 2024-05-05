from django.urls import path
from . import views

urlpatterns = [
    path('editprofile/', views.edit_profile),
]