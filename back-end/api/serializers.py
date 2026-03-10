from .models import User
from .models import MasterCategory, SubCategory, Product
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


class SubCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SubCategory
        fields = ['id', 'master_category', 'name', 'slug', 'is_active']
        read_only_fields = ['id', 'slug', 'is_active']


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

    def validate(self, attrs):
        if not attrs.get('sub_category'):
            raise serializers.ValidationError({"sub_category": "Sub category is required"})
        if not attrs.get('name'):
            raise serializers.ValidationError({"name": "Name is required"})
        if not attrs.get('description'):
            raise serializers.ValidationError({"description": "Description is required"})
        if not attrs.get('size'):
            raise serializers.ValidationError({"size": "Size is required"})
        if not attrs.get('price'):
            raise serializers.ValidationError({"price": "Price is required"})
        # if not attrs.get('image'):
        #     raise serializers.ValidationError({"image": "Image is required"})
        return attrs