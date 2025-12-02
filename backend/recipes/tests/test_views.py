from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model
from recipes.models import Recipe
import json

class RecipeViewSetTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        # Set up data for the whole TestCase
        # This runs once for the whole TestCase
        cls.user = get_user_model().objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        cls.other_user = get_user_model().objects.create_user(
            username='otheruser',
            email='other@example.com',
            password='otherpass123'
        )
    
    def setUp(self):
        # This runs before each test
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        
        # Clear any existing recipes
        Recipe.objects.all().delete()
        
        # Create a test recipe for the current user
        self.recipe = Recipe.objects.create(
            owner=self.user,
            title='Test Recipe',
            description='A test recipe',
            ingredients='Ingredient 1\nIngredient 2',
            steps='Step 1\nStep 2',
            youtube_url='https://www.youtube.com/watch?v=test'
        )
        
        # Create another recipe for another user
        self.other_recipe = Recipe.objects.create(
            owner=self.other_user,
            title='Other User Recipe',
            description='Another test recipe',
            ingredients='Other Ingredient',
            steps='Other Step',
        )
    
    def test_recipe_list(self):
        """Test that users can only see their own recipes"""
        # Print debug info
        print("\n=== Debug: Starting test_recipe_list ===")
        print(f"Current user: {self.user.username} (id: {self.user.id})")
        
        # List all recipes in the database before creating new ones
        all_recipes = Recipe.objects.all()
        print(f"Recipes in DB before test: {all_recipes.count()}")
        for r in all_recipes:
            print(f"  - {r.title} (id: {r.id}, owner: {r.owner.username})")
        
        # Create 2 more recipes for the current user
        test_recipes = []
        for i in range(2):
            recipe = Recipe.objects.create(
                owner=self.user,
                title=f'Test Recipe {i+2}',
                description=f'Test description {i+2}',
                ingredients=f'Ingredient {i+2}',
                steps=f'Step {i+2}'
            )
            test_recipes.append(recipe)
            print(f"Created test recipe: {recipe.title} (id: {recipe.id})")
        
        # Get the list of recipes
        url = reverse('recipe-list')
        print(f"\nMaking request to: {url}")
        response = self.client.get(url)
        
        # Print raw response content
        print("\nRaw response content:")
        print(response.content)
        
        # Parse response data
        try:
            response_data = response.json()
            print(f"\nResponse status: {response.status_code}")
            print(f"Response data type: {type(response_data)}")
            print(f"Response data: {response_data}")
            
            # Handle paginated response
            if 'results' in response_data:
                results = response_data['results']
                print(f"Results count: {len(results)}")
                for i, recipe in enumerate(results, 1):
                    print(f"  {i}. {recipe.get('title')} (id: {recipe.get('id')}, owner: {recipe.get('owner')})")
            else:
                print(f"Response data count: {len(response_data)}")
                for i, recipe in enumerate(response_data, 1):
                    print(f"  {i}. {recipe.get('title')} (id: {recipe.get('id')}, owner: {recipe.get('owner')})")
        except Exception as e:
            print(f"Error parsing response: {e}")
            response_data = []
        
        # Check the response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Get all recipes for the current user
        user_recipes = Recipe.objects.filter(owner=self.user)
        print(f"\nUser's recipes in DB: {user_recipes.count()}")
        for r in user_recipes:
            print(f"  - {r.title} (id: {r.id})")
        
        # Get the results from the paginated response
        if 'results' in response_data:
            results = response_data['results']
            total_count = response_data['count']
            print(f"Found {len(results)} results out of {total_count} total")
            
            # Verify the count matches the number of user recipes
            self.assertEqual(total_count, user_recipes.count())
            
            # Get the IDs of all recipes owned by the current user
            user_recipe_ids = set(user_recipes.values_list('id', flat=True))
            
            # Verify that all returned recipes belong to the current user
            for recipe_data in results:
                self.assertEqual(recipe_data['owner'], self.user.id)
                self.assertIn(recipe_data['id'], user_recipe_ids)
            
            # Verify the exact recipes returned
            returned_ids = {recipe['id'] for recipe in results}
            expected_ids = set(user_recipes.values_list('id', flat=True))
            
            print(f"\nReturned recipe IDs: {returned_ids}")
            print(f"Expected recipe IDs: {expected_ids}")
            
            self.assertEqual(returned_ids, expected_ids)
        else:
            # Handle non-paginated response (shouldn't happen with default settings)
            self.fail("Expected paginated response with 'results' key")
    
    def test_recipe_search(self):
        """Test searching recipes"""
        # Clear any existing recipes
        Recipe.objects.all().delete()
        
        # Create test recipes
        pasta_recipe = Recipe.objects.create(
            owner=self.user,
            title='Pasta Recipe',
            description='Delicious pasta',
            ingredients='Pasta\nTomato\nCheese',
            steps='Cook pasta\nAdd sauce'
        )
        
        salad_recipe = Recipe.objects.create(
            owner=self.user,
            title='Salad Recipe',
            description='Healthy salad',
            ingredients='Lettuce\nTomato\nCucumber',
            steps='Chop ingredients\nMix together'
        )
        
        # Search for 'Pasta' (should find 1 recipe)
        url = f"{reverse('recipe-list')}?q=Pasta"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Parse response data
        response_data = response.json()
        self.assertIn('results', response_data)
        self.assertEqual(len(response_data['results']), 1)
        self.assertEqual(response_data['results'][0]['id'], pasta_recipe.id)
        
        # Search for 'Tomato' (should find 2 recipes)
        url = f"{reverse('recipe-list')}?q=Tomato"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Parse response data
        response_data = response.json()
        self.assertIn('results', response_data)
        self.assertEqual(len(response_data['results']), 2)
        
        # Verify both recipes are in the results
        returned_ids = {recipe['id'] for recipe in response_data['results']}
        self.assertIn(pasta_recipe.id, returned_ids)
        self.assertIn(salad_recipe.id, returned_ids)
        
        # Search for 'nonexistent' (should find 0 recipes)
        url = f"{reverse('recipe-list')}?q=nonexistent"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Parse response data
        response_data = response.json()
        self.assertIn('results', response_data)
        self.assertEqual(len(response_data['results']), 0)
    
    def test_create_recipe(self):
        """Test creating a new recipe"""
        url = reverse('recipe-list')
        data = {
            'title': 'New Recipe',
            'description': 'A new test recipe',
            'ingredients': 'New Ingredient 1\nNew Ingredient 2',
            'steps': 'New Step 1\nNew Step 2',
            'youtube_url': 'https://www.youtube.com/watch?v=new'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Recipe.objects.count(), 3)  # 2 from setUp + 1 new
        self.assertEqual(Recipe.objects.latest('id').title, 'New Recipe')
    
    def test_update_recipe(self):
        """Test updating a recipe"""
        url = reverse('recipe-detail', args=[self.recipe.id])
        data = {'title': 'Updated Recipe Title'}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.recipe.refresh_from_db()
        self.assertEqual(self.recipe.title, 'Updated Recipe Title')
    
    def test_delete_recipe(self):
        """Test deleting a recipe"""
        url = reverse('recipe-detail', args=[self.recipe.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Recipe.objects.count(), 1)  # Only other_user's recipe remains
    
    def test_cannot_access_other_users_recipe(self):
        """Test that users cannot access other users' recipes"""
        # Try to access other user's recipe
        url = reverse('recipe-detail', args=[self.other_recipe.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
        # Try to update other user's recipe
        response = self.client.patch(url, {'title': 'Hacked'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
        # Try to delete other user's recipe
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_unauthenticated_access(self):
        """Test that unauthenticated users cannot access the API"""
        self.client.logout()
        
        # Try to list recipes
        url = reverse('recipe-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        # Try to create a recipe
        response = self.client.post(url, {})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
