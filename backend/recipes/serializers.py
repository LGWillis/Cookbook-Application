from rest_framework import serializers
from .models import Recipe


class RecipeSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(read_only=True)
    image_url = serializers.SerializerMethodField(read_only=True)
    image_thumbnail_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Recipe
        fields = [
            "id",
            "owner",
            "title",
            "description",
            "ingredients",
            "steps",
            "youtube_url",
            "image",
            "image_url",
            "image_thumbnail_url",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "owner", "image_url", "image_thumbnail_url", "created_at", "updated_at"]

    def get_image_url(self, obj):
        request = self.context.get("request")
        if obj.image and hasattr(obj.image, "url"):
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

    def get_image_thumbnail_url(self, obj):
        request = self.context.get("request")
        if obj.image_thumbnail and hasattr(obj.image_thumbnail, "url"):
            if request:
                return request.build_absolute_uri(obj.image_thumbnail.url)
            return obj.image_thumbnail.url
        return None
