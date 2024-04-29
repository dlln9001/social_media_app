from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    following = models.ManyToManyField('self', blank=True)
    followers = models.ManyToManyField('self', blank=True)
    bio = models.TextField(max_length=150, blank=True, default='')
