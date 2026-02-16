import re
from venv import create
from django import db
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models




class UserManager(BaseUserManager):
    def create_user(self, username, email=None, password=None, **extra_fields):
        if not username:
            raise ValueError("Username is required")
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_unusable_password()  # no password stored
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if not password:
            raise ValueError("Superuser must have a password")

        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user


# Create your models here.
class User(AbstractUser):
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

    objects = UserManager() 

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email"]

    class Meta:
        db_table = "users"

    def __str__(self):
        return f"{self.username} - {self.email}"


# Product model
class Master_Category(models.Model):
    boys_id = models.CharField(max_length= 100, unique=True, null=False, blank=False)
    girls_id = models.CharField(max_length= 100, unique=True, null=False, blank=False)
    kides_id = models.CharField(max_length= 100, unique=True, null=False, blank=False)
    active = models.BooleanField(default=True)
    slug = models.SlugField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "master_category"

    def __str__(self):
        return f"{self.boys_id} - {self.girls_id} - {self.kides_id}"
    

# Boyes Category model
class sub_boys_category(models.Model):
    master_category = models.ForeignKey(Master_Category, on_delete=models.CASCADE, related_name='sub_categories')
    sports_shoes_identify = models.CharField(max_length=100, unique=True, null=False, blank=False)
    casual_shoes_identify = models.CharField(max_length=100, unique=True, null=False, blank=False)
    pary_shoes_identify = models.CharField(max_length=100, unique=True, null=False, blank=False)
    runnig_shoes_identify = models.CharField(max_length=100, unique=True, null=False, blank=False)
    active = models.BooleanField(default=True)
    slug = models.SlugField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "sub_boys_category"
    
    def __str__(self):
        return f"{self.sports_shoes_identify} - {self.casual_shoes_identify} - {self.pary_shoes_identify} - {self.runnig_shoes_identify}"


# Girls Category model
class sub_girls_category(models.Model):
    master_category = models.ForeignKey(Master_Category, on_delete=models.CASCADE, related_name='sub_girls_categories')
    sports_shoes_identify = models.CharField(max_length=100, unique=True, null=False, blank=False)
    casual_shoes_identify = models.CharField(max_length=100, unique=True, null=False, blank=False)
    pary_shoes_identify = models.CharField(max_length=100, unique=True, null=False, blank=False)
    runnig_shoes_identify = models.CharField(max_length=100, unique=True, null=False, blank=False)
    active = models.BooleanField(default=True)
    slug = models.SlugField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "sub_girls_category"
    
    def __str__(self):
        return f"{self.sports_shoes_identify} - {self.casual_shoes_identify} - {self.pary_shoes_identify} - {self.runnig_shoes_identify}"


# Kids Category model
class sub_kids_category(models.Model):
    master_category = models.ForeignKey(Master_Category, on_delete=models.CASCADE, related_name='sub_kids_categories')
    sports_shoes_identify = models.CharField(max_length=100, unique=True, null=False, blank=False)
    casual_shoes_identify = models.CharField(max_length=100, unique=True, null=False, blank=False)
    pary_shoes_identify = models.CharField(max_length=100, unique=True, null=False, blank=False)
    runnig_shoes_identify = models.CharField(max_length=100, unique=True, null=False, blank=False)
    active = models.BooleanField(default=True)
    slug = models.SlugField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "sub_kids_category"
    
    def __str__(self):
        return f"{self.sports_shoes_identify} - {self.casual_shoes_identify} - {self.pary_shoes_identify} - {self.runnig_shoes_identify}"


# Casual shoe Model
class Casual_Shoes(models.Model):
    sub_boyes_id = models.ForeignKey(sub_boys_category, on_delete=models.CASCADE, related_name='casual_shoes_boys')
    name = models.CharField(max_length=255, unique=True, null=False, blank=False)
    b_c_s_image = models.URLField(max_length=500, blank=True, null=True)
    b_c_s_description = models.TextField(blank=False, null=False)
    b_c_s_size = models.CharField(max_length=50, null=False, blank=False)
    b_c_s_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    b_c_s_slug = models.SlugField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "casual_shoes_boys"
    
    def __str__(self):
        return f"{self.name} - {self.b_c_s_price}"
    
