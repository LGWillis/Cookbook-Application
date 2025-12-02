from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from io import BytesIO
from PIL import Image
import os
from django.conf import settings
from recipes.models import Recipe

def create_test_image():
    """Helper function to create a test image"""
    image = Image.new('RGB', (100, 100), color='red')
    image_io = BytesIO()
    image.save(image_io, format='JPEG')
    return SimpleUploadedFile(
        'test_image.jpg',
        image_io.getvalue(),
        content_type='image/jpeg'
    )

class RecipeModelTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.recipe = Recipe.objects.create(
            owner=self.user,
            title='Test Recipe',
            description='A test recipe description',
            ingredients='Ingredient 1\nIngredient 2',
            steps='Step 1\nStep 2',
            youtube_url='https://www.youtube.com/watch?v=test'
        )

    def test_recipe_creation(self):
        """Test that a recipe can be created"""
        self.assertEqual(self.recipe.title, 'Test Recipe')
        self.assertEqual(self.recipe.owner, self.user)
        self.assertEqual(self.recipe.ingredients, 'Ingredient 1\nIngredient 2')
        self.assertEqual(self.recipe.steps, 'Step 1\nStep 2')
        self.assertEqual(self.recipe.youtube_url, 'https://www.youtube.com/watch?v=test')

    def test_recipe_string_representation(self):
        """Test the string representation of the recipe"""
        self.assertEqual(str(self.recipe), f'Test Recipe (by {self.user})')

    def test_recipe_ordering(self):
        """Test that recipes are ordered by creation date (newest first)"""
        # Refresh the recipe to ensure we have the latest timestamps
        original_recipe = Recipe.objects.get(id=self.recipe.id)
        
        # Create a new recipe - it should have a more recent timestamp
        new_recipe = Recipe.objects.create(
            owner=self.user,
            title='Newer Recipe',
            description='A newer recipe',
            ingredients='Ingredient',
            steps='Step'
        )
        
        # Get all recipes ordered by creation date (newest first)
        recipes = list(Recipe.objects.all())
        
        # The first recipe should be the newest one we just created
        self.assertEqual(recipes[0].id, new_recipe.id)
        self.assertEqual(recipes[0].title, 'Newer Recipe')
        
        # The second recipe should be the one from setUp
        self.assertEqual(recipes[1].id, self.recipe.id)
        self.assertEqual(recipes[1].title, 'Test Recipe')

    def test_recipe_thumbnail_creation(self):
        """Test that a thumbnail is created when an image is uploaded"""
        # Skip this test if PIL is not available
        try:
            from PIL import Image
        except ImportError:
            self.skipTest("PIL not available, skipping thumbnail test")
            
        # Create a test image
        test_image = create_test_image()
        
        # Create a recipe with an image
        recipe = None
        try:
            recipe = Recipe.objects.create(
                owner=self.user,
                title='Recipe with Image',
                description='A recipe with an image',
                ingredients='Ingredient',
                steps='Step',
                image=test_image
            )
            
            # Check that the thumbnail was created
            self.assertTrue(recipe.image_thumbnail)
            self.assertIn('thumb_', os.path.basename(recipe.image_thumbnail.name))
            
        finally:
            # Clean up the test files
            if recipe:
                # Close file handles
                if hasattr(recipe.image, 'close'):
                    recipe.image.close()
                if hasattr(recipe, 'image_thumbnail') and recipe.image_thumbnail and hasattr(recipe.image_thumbnail, 'close'):
                    recipe.image_thumbnail.close()
                
                # Delete the files
                if hasattr(recipe.image, 'path') and os.path.exists(recipe.image.path):
                    try:
                        os.remove(recipe.image.path)
                    except (OSError, PermissionError):
                        pass
                if hasattr(recipe, 'image_thumbnail') and recipe.image_thumbnail:
                    if hasattr(recipe.image_thumbnail, 'path') and os.path.exists(recipe.image_thumbnail.path):
                        try:
                            os.remove(recipe.image_thumbnail.path)
                        except (OSError, PermissionError):
                            pass
                
                # Delete the recipe from the database
                recipe.delete()

    def test_recipe_update(self):
        """Test that a recipe can be updated"""
        self.recipe.title = 'Updated Recipe Title'
        self.recipe.save()
        updated_recipe = Recipe.objects.get(id=self.recipe.id)
        self.assertEqual(updated_recipe.title, 'Updated Recipe Title')
