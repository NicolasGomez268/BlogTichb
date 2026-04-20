from rest_framework import serializers
from django.utils.text import slugify

from .models import Article, ArticleImage


class ArticleSerializer(serializers.ModelSerializer):
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False,
    )
    images = serializers.SerializerMethodField(read_only=True)

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
            "uploaded_images",
            "images",
            "published_at",
            "status",
        ]
        read_only_fields = ["id"]
        extra_kwargs = {
            "slug": {"required": False, "allow_blank": True},
        }

    def get_images(self, obj):
        request = self.context.get("request")
        images = []

        if obj.cover_image:
            cover_url = obj.cover_image.url
            images.append(request.build_absolute_uri(cover_url) if request else cover_url)

        for gallery_item in obj.extra_images.all():
            gallery_url = gallery_item.image.url
            images.append(request.build_absolute_uri(gallery_url) if request else gallery_url)

        return images

    def validate(self, attrs):
        uploaded_images = attrs.get("uploaded_images", [])
        cover_image = attrs.get("cover_image")

        if uploaded_images and len(uploaded_images) > 5:
            raise serializers.ValidationError("Solo se permiten hasta 5 fotos por noticia")

        if self.instance is None and not uploaded_images and not cover_image:
            raise serializers.ValidationError("Debes subir al menos una foto")

        return attrs

    def _build_unique_slug(self, base_value: str) -> str:
        base_slug = slugify(base_value) or "noticia"
        candidate = base_slug
        suffix = 1

        while Article.objects.filter(slug=candidate).exists():
            candidate = f"{base_slug}-{suffix}"
            suffix += 1

        return candidate

    def create(self, validated_data):
        uploaded_images = validated_data.pop("uploaded_images", [])
        raw_slug = validated_data.get("slug", "").strip()

        if not raw_slug:
            validated_data["slug"] = self._build_unique_slug(validated_data.get("title", ""))

        if uploaded_images and "cover_image" not in validated_data:
            validated_data["cover_image"] = uploaded_images[0]
            uploaded_images = uploaded_images[1:]

        article = super().create(validated_data)

        for index, image in enumerate(uploaded_images):
            ArticleImage.objects.create(article=article, image=image, order=index)

        return article

    def update(self, instance, validated_data):
        uploaded_images = validated_data.pop("uploaded_images", None)

        article = super().update(instance, validated_data)

        if uploaded_images is not None and len(uploaded_images) > 0:
            article.cover_image = uploaded_images[0]
            article.save(update_fields=["cover_image", "updated_at"])

            article.extra_images.all().delete()

            for index, image in enumerate(uploaded_images[1:5]):
                ArticleImage.objects.create(article=article, image=image, order=index)

        return article
