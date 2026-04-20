from django.db import models
from django.utils import timezone


class Article(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "Borrador"
        PUBLISHED = "published", "Publicado"

    title = models.CharField(max_length=220)
    category = models.CharField(max_length=120, default="Liga Federal de Basquet")
    lead = models.TextField(blank=True, default="")
    slug = models.SlugField(max_length=240, unique=True)
    content = models.TextField()
    cover_image = models.ImageField(upload_to="articles/covers/")
    published_at = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.DRAFT)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-published_at", "-created_at"]
        indexes = [
            models.Index(fields=["status", "-published_at"]),
            models.Index(fields=["slug"]),
        ]

    def __str__(self) -> str:
        return self.title


class ArticleImage(models.Model):
    article = models.ForeignKey(Article, related_name="extra_images", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="articles/gallery/")
    order = models.PositiveSmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self) -> str:
        return f"{self.article.title} - imagen {self.id}"
