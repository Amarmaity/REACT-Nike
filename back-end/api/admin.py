from re import sub
from django.contrib import admin
from .models import (
    User,
    MasterCategory,
    SubCategory,
    Product,
    ProductImage,
    ProductVariant,
    ProductVariantImage,
    CustomerDetails
)
# Register your models here.

admin.site.register(User)
admin.site.register(MasterCategory)
admin.site.register(SubCategory)
admin.site.register(Product)
admin.site.register(ProductImage)
admin.site.register(ProductVariant)
admin.site.register(ProductVariantImage)
admin.site.register(CustomerDetails)