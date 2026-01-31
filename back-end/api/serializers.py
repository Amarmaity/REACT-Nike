from .models import User
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):

    phone = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'phone', 'role']

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            phone=validated_data.get('phone', ''),
        )
        return user
