from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class ImagePost(models.Model):
    FK_Image_User = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='images/posts/')
    aspect_ratio = models.CharField(max_length=100, default='one_to_one')