from rest_framework import serializers

from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["name", "description", "price"]
        extra_kwargs = {
            "product_date": {"read_only": True},
        }

    def create(self, validated_data):
        user = self.context["request"].user
        return Product.objects.create(author=user, **validated_data)
