# Generated by Django 4.2.11 on 2024-05-02 07:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('create_post', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='imagepost',
            name='aspect_ratio',
            field=models.CharField(default='one_to_one', max_length=100),
        ),
    ]