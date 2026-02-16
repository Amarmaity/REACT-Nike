from re import sub
from django.contrib import admin
from .models import Casual_Shoes, Master_Category, User, sub_boys_category, sub_girls_category, sub_kids_category
# Register your models here.

admin.site.register(User)
admin.site.register(Master_Category)
admin.site.register(sub_boys_category)
admin.site.register(sub_girls_category)
admin.site.register(sub_kids_category)
admin.site.register(Casual_Shoes)