from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True)
    avatar_url = models.URLField(blank=True)
    location = models.CharField(max_length=100, blank=True)
    website = models.URLField(blank=True)
    annual_reading_goal = models.IntegerField(default=0)
    VISIBILITY_CHOICES = [
        ('public', 'Public'),
        ('followers_only', 'Followers Only'),
        ('private', 'Private'),
    ]
    profile_visibility = models.CharField(max_length=20, choices=VISIBILITY_CHOICES, default='public')
    show_reading_activity = models.BooleanField(default=True)
    allow_others_see_shelves = models.BooleanField(default=True)
    allow_others_see_stats = models.BooleanField(default=True)
    username_changes_count = models.IntegerField(default=0)
    last_username_change_at = models.DateTimeField(null=True, blank=True)