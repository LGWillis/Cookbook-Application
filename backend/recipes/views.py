from django.db.models import Q
from rest_framework import permissions, viewsets
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from .models import Recipe
from .serializers import RecipeSerializer


class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user


class RecipeViewSet(viewsets.ModelViewSet):
    serializer_class = RecipeSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        qs = Recipe.objects.filter(owner=self.request.user)
        q = self.request.query_params.get("q")
        if q:
            qs = qs.filter(Q(title__icontains=q) | Q(ingredients__icontains=q))
        return qs

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
