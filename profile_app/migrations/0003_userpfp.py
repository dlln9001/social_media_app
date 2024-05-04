# Generated by Django 4.2.11 on 2024-05-04 06:32

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('profile_app', '0002_alter_userprofile_bio'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserPfp',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_pfp_url', models.ImageField(upload_to='images/profile_pictures/')),
                ('FK_User_UserPfp', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
