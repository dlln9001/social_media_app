from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    following = models.ManyToManyField('self', blank=True)
    followers = models.ManyToManyField('self', blank=True)
    bio = models.TextField(max_length=150, blank=True, default='')


class UserPfp(models.Model):
    FK_User_UserPfp = models.OneToOneField(User, on_delete=models.CASCADE)
    user_pfp_url = models.ImageField(upload_to='images/profile_pictures/')
    default_pfp = models.BooleanField(default=True)