from django.contrib import admin
from .models import Recipe


@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "owner", "created_at")
    search_fields = ("title", "ingredients")
    list_filter = ("created_at",)
