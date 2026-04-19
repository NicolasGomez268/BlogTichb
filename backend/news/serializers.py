from rest_framework import serializers
from django.utils.text import slugify

from .models import Article


class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = [
            "id",
            "title",
            "category",
            "lead",
            "slug",
            "content",
            "cover_image",
            "published_at",
            "status",
        ]
        read_only_fields = ["id"]
        extra_kwargs = {
            "slug": {"required": False, "allow_blank": True},
        }

    def _build_unique_slug(self, base_value: str) -> str:
        base_slug = slugify(base_value) or "noticia"
        candidate = base_slug
        suffix = 1

        while Article.objects.filter(slug=candidate).exists():
            candidate = f"{base_slug}-{suffix}"
            suffix += 1

        return candidate

    def create(self, validated_data):
        raw_slug = validated_data.get("slug", "").strip()

        if not raw_slug:
            validated_data["slug"] = self._build_unique_slug(validated_data.get("title", ""))

        return super().create(validated_data)
