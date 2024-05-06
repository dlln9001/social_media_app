# Generated by Django 4.2.11 on 2024-05-06 00:04

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('create_post', '0002_imagepost_aspect_ratio'),
    ]

    operations = [
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.CharField(default='', max_length=4000)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.AddField(
            model_name='imagepost',
            name='date_created',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.CreateModel(
            name='Like',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('FK_Like_Comment', models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, to='create_post.comment')),
                ('FK_Like_Post', models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, to='create_post.imagepost')),
                ('FK_Like_User', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='comment',
            name='FK_Comment_ImagePost',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='create_post.imagepost'),
        ),
        migrations.AddField(
            model_name='comment',
            name='FK_Comment_User',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]