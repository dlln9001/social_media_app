# Generated by Django 4.2.11 on 2024-05-08 00:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('profile_app', '0004_userpfp_default_pfp'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userprofile',
            name='followers',
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='following',
            field=models.ManyToManyField(blank=True, related_name='followers', to='profile_app.userprofile'),
        ),
    ]
