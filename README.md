# RecipeShare

RecipeShare is a recipe discovery app that suggests personalized meal ideas based on your dietary preferences and available ingredients.

## Technology Stack
- **Frontend**: React (Vite), Tailwind CSS, Nginx (container serving build)
- **Backend**: Django, Django REST Framework, SimpleJWT, Gunicorn
- **Database**: PostgreSQL (Cloud SQL)
- **Storage/Media**: Local container storage (DEV); optional GCS in PROD
- **Containerization**: Docker, Docker Compose
- **Deployment**: Google Cloud Run (services, jobs), Artifact Registry


## Getting Started
1. Clone the repository: `git clone https://github.com/username/recipeapp.git`
2. Install dependencies: `npm install`
3. Set up environment variables: `cp .env.example .env`
4. Start the app: `npm run dev`

## Preview
Place your screenshot at `docs/screenshot.png` (or update the path below), then it will render on GitHub:

![RecipeShare preview](docs/screenshot.png)
