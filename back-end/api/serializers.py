from .models import User
from .models import Master_Category, sub_boys_category
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):

    phone = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'phone', 'role']

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            phone=validated_data.get('phone', ''),
        )
        user.set_unusable_password()
        user.save()
        return user



class MasterCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = MasterCategory
        fields = ['id', 'name', 'slug', 'is_active']
        read_only_fields = ['id', 'slug', 'is_active']

    def create(self, validated_data):
        Mastercategory = validated_data['name'],
        slug = validated_data['slug'],
        is_active = validated_data['is_active']
        return Master_Category.objects.create(Mastercategory, slug, is_active)



class SubCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SubCategory
        fields = ['id', 'master_category', 'name', 'slug', 'is_active']
        read_only_fields = ['id', 'slug', 'is_active']

    def create(self, validated_data):
        Subcategory = validated_data['name'],
        master_category = validated_data['master_category'],
        slug = validated_data['slug'],
        is_active = validated_data['is_active']
        return sub_boys_category.objects.create(Subcategory, slug, is_active)



# ---------------------------
# Product Serializer
# ---------------------------
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'id',
            'sub_category',
            'name',
            'description',
            'size',
            'price',
            'image',
            'slug',
            'is_active'
        ]
        read_only_fields = ['id', 'slug', 'is_active']