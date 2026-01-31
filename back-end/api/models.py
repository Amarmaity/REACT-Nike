from django.db import models


# Create your models here.
class User(models.Model):
    ROLE_CHOICE = (
        ('admin', 'Admin'),
        ('user', 'User'),
    )
    username = models.CharField(max_length=100, blank=True, null=True,
                                unique=True)
    email = models.EmailField(blank=True, null=True, unique=True)
    phone = models.CharField(max_length=15, blank=True, null=True, unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICE, default='user')
    is_active = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "users"

    def __str__(self):
        return f"{self.username} - {self.email}"
