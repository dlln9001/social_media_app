from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class ImagePost(models.Model):
    FK_Image_User = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='images/posts/')
    aspect_ratio = models.CharField(max_length=100, default='one_to_one')
    date_created = models.DateTimeField(auto_now_add=True)

class Comment(models.Model):
    FK_Comment_ImagePost = models.ForeignKey(ImagePost, on_delete=models.CASCADE)
    FK_Comment_User = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.CharField(max_length=4000, default='')
    date_created = models.DateTimeField(auto_now_add=True)

class Like(models.Model):
    FK_Like_User = models.ForeignKey(User, on_delete=models.CASCADE)
    # you can like a post or a comment
    FK_Like_Post = models.ForeignKey(ImagePost, on_delete=models.CASCADE, blank=True, null=True)
    FK_Like_Comment = models.ForeignKey(Comment, on_delete=models.CASCADE, blank=True, null=True)
    date_created = models.DateTimeField(auto_now_add=True)