import re
from venv import create
from django import db
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils.text import slugify


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
        ("admin", "Admin"),
        ("user", "User"),
    )
    username = models.CharField(max_length=100, blank=True, null=True, unique=True)
    email = models.EmailField(blank=True, null=True, unique=True)
    phone = models.CharField(max_length=15, blank=True, null=True, unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICE, default="user")
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


# Master category model
class MasterCategory(models.Model):
    name = models.CharField(max_length=100, unique=True, null=False, blank=False)
    is_active = models.BooleanField(default=True)
    slug = models.SlugField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "master_category"

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            while MasterCategory.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name}"


# Category model
class SubCategory(models.Model):
    master_category = models.ForeignKey(
        MasterCategory, on_delete=models.CASCADE, related_name="sub_categories"
    )
    name = models.CharField(max_length=100, unique=True, null=False, blank=False)
    description = models.TextField(blank=True, default="")
    image = models.ImageField(upload_to="sub-categories/", blank=True, null=True)
    is_active = models.BooleanField(default=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "sub_category"
        unique_together = ("master_category", "name")

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            while SubCategory.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name}"


# Products model
<<<<<<< Updated upstream
class Product(models.Model):
    PRODUCT_TYPE_CHOICES = (
        ("simple", "Simple"),
        ("variable", "Variable"),
    )

    sub_category = models.ForeignKey(
        SubCategory, on_delete=models.CASCADE, related_name="products"
    )
    name = models.CharField(max_length=255)
    description = models.TextField()
    short_description = models.CharField(max_length=255, blank=True, default="")
    product_type = models.CharField(
        max_length=20, choices=PRODUCT_TYPE_CHOICES, default="simple"
    )
    sku = models.CharField(max_length=100, unique=True, blank=True, null=True)
    base_sku = models.CharField(max_length=100, blank=True, default="")
    price = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    compare_at_price = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    image = models.ImageField(upload_to="products/", blank=True, null=True)
    slug = models.SlugField(unique=True, blank=True)
    is_featured = models.BooleanField(default=False)
    track_quantity = models.BooleanField(default=True)
    stock_quantity = models.PositiveIntegerField(default=0)
    options = models.JSONField(default=list, blank=True)
    tags = models.JSONField(default=list, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
=======
class Product(models.Model):
    PRODUCT_TYPE_CHOICES = (
        ("simple", "Simple"),
        ("variable", "Variable"),
    )

    sub_category = models.ForeignKey(
        SubCategory, on_delete=models.CASCADE, related_name="products"
    )
    name = models.CharField(max_length=255)
    description = models.TextField()
    short_description = models.CharField(max_length=255, blank=True, default="")
    product_type = models.CharField(
        max_length=20, choices=PRODUCT_TYPE_CHOICES, default="simple"
    )
    sku = models.CharField(max_length=100, unique=True, blank=True, null=True)
    base_sku = models.CharField(max_length=100, blank=True, default="")
    price = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    compare_at_price = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    image = models.ImageField(upload_to="products/", blank=True, null=True)
    slug = models.SlugField(unique=True, blank=True)
    is_featured = models.BooleanField(default=False)
    track_quantity = models.BooleanField(default=True)
    stock_quantity = models.PositiveIntegerField(default=0)
    options = models.JSONField(default=list, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
>>>>>>> Stashed changes

    class Meta:
        db_table = "product"

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(f"{self.sub_category.name}-{self.name}")
            slug = base_slug
            counter = 1

            while Product.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1

            self.slug = slug

        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class ProductImage(models.Model):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="gallery_images"
    )
    image = models.ImageField(upload_to="products/gallery/")
    alt_text = models.CharField(max_length=255, blank=True, default="")
    sort_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "product_image"
        ordering = ["sort_order", "id"]

    def __str__(self):
        return f"{self.product.name} image {self.id}"


class ProductVariant(models.Model):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="variants"
    )
    title = models.CharField(max_length=255, blank=True, default="")
    sku = models.CharField(max_length=100, unique=True)
    attributes = models.JSONField(default=dict)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    compare_at_price = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )
    stock_quantity = models.PositiveIntegerField(default=0)
    track_quantity = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "product_variant"
        ordering = ["sort_order", "id"]

    def __str__(self):
        return f"{self.product.name} - {self.sku}"


class ProductVariantImage(models.Model):
    variant = models.ForeignKey(
        ProductVariant, on_delete=models.CASCADE, related_name="images"
    )
    image = models.ImageField(upload_to="products/variants/")
    sort_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "product_variant_image"
        ordering = ["sort_order", "id"]

    def __str__(self):
        return f"{self.variant.sku} image {self.id}"



#--------------------
#Customer 
#-------------------
class CustomerDetails (models.Model):
    c_name = models.CharField(max_length=100, blank=True, null=True)
    c_mobile = models.CharField(max_length=15, blank=True, unique=True, null=True)
    c_email = models.EmailField(blank=True, null=True, unique=True)
    c_login_time = models.TimeField(blank=True, null=True)
    c_profile = models.FileField(blank=True, null=True)
    c_address = models.CharField(max_length=100, blank=True, null=True)
    c_city = models.CharField(max_length=100, blank=True, null=True)
    c_state = models.CharField(max_length=100, blank=True, null=True)
    c_pin = models.CharField(max_length=10, blank=True, null=True)
    cretated_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "customer_details"

    def __str__(self):
        return f"{self.c_name}, {self.c_mobile}"