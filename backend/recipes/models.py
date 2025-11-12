from django.conf import settings
from django.db import models
from io import BytesIO
from PIL import Image
from django.core.files.base import ContentFile


class Recipe(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="recipes",
    )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    ingredients = models.TextField(help_text="One ingredient per line")
    steps = models.TextField(help_text="One step per line")
    youtube_url = models.URLField(blank=True, null=True)
    image = models.ImageField(upload_to="recipes/", blank=True, null=True)
    image_thumbnail = models.ImageField(upload_to="recipes/thumbs/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.title} (by {self.owner})"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.image and (not self.image_thumbnail or not self.image_thumbnail.name):
            try:
                self._generate_thumbnail()
            except Exception:
                pass

    def _generate_thumbnail(self, size=(256, 256)):
        self.image.open()
        img = Image.open(self.image)
        img.convert('RGB')
        img.thumbnail(size)
        thumb_io = BytesIO()
        img.save(thumb_io, format='JPEG', quality=85)
        thumb_name = f"thumb_{self.image.name.split('/')[-1].rsplit('.', 1)[0]}.jpg"
        self.image_thumbnail.save(thumb_name, ContentFile(thumb_io.getvalue()), save=False)
        super().save(update_fields=["image_thumbnail"]) 
