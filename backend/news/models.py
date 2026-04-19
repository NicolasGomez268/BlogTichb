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
