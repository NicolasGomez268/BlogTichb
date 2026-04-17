from django.contrib import admin

from .models import Article


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ("title", "status", "published_at", "created_at")
    list_filter = ("status", "published_at")
    prepopulated_fields = {"slug": ("title",)}
    search_fields = ("title", "content")
