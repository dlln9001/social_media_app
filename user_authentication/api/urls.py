from django.urls import path
from . import views

urlpatterns = [
    path('', views.getData),
    path('signup/', views.signup),
    path('login/', views.login),
]