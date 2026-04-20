from django.utils import timezone
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .models import Article
from .serializers import ArticleSerializer


class ArticleViewSet(viewsets.ModelViewSet):
    serializer_class = ArticleSerializer
    lookup_field = "slug"
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        base_queryset = Article.objects.prefetch_related("extra_images").order_by("-published_at")

        if self.request.user.is_authenticated:
            return base_queryset

        return base_queryset.filter(
            status=Article.Status.PUBLISHED,
            published_at__lte=timezone.now(),
        )
