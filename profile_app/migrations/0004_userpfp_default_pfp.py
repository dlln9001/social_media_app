# Generated by Django 4.2.11 on 2024-05-04 07:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('profile_app', '0003_userpfp'),
    ]

    operations = [
        migrations.AddField(
            model_name='userpfp',
            name='default_pfp',
            field=models.BooleanField(default=True),
        ),
    ]