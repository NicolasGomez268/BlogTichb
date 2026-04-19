from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("news", "0002_article_category"),
    ]

    operations = [
        migrations.AddField(
            model_name="article",
            name="lead",
            field=models.TextField(blank=True, default=""),
        ),
    ]
