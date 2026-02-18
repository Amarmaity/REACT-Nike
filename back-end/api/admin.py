from re import sub
from django.contrib import admin
from .models import User, MasterCategory, SubCategory, Product
# Register your models here.

admin.site.register(User)
admin.site.register(MasterCategory)
admin.site.register(SubCategory)
admin.site.register(Product)