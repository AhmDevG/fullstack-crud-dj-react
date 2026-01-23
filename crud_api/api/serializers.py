from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Product


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "date_joined",
        ]
        extra_kwargs = {
            "date_joined": {"read_only": True},
            "id": {"read_only": True},
        }


class ProductSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "author",
            "name",
            "description",
            "price",
            "date",
        ]
        extra_kwargs = {
            "product_date": {"read_only": True},
            "author": {"read_only": True},
            "date": {"read_only": True},
            "id": {"read_only": True},
        }

    def create(self, validated_data):
        user = self.context["request"].user
        return Product.objects.create(author=user, **validated_data)
