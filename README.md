# Cookbook Application

A modern recipe management application with a React frontend and Django backend, fully containerized with Docker.

## Features

- 📸 Visual recipe management with image uploads
- 🔍 Search recipes by title or ingredients
- 🎬 Embed YouTube video tutorials
- 👤 User authentication and authorization
- 🎨 Modern dark theme UI with Tailwind CSS
- 🐳 Fully containerized with Docker Compose

## Technology Stack

**Frontend:**
- React 18 with React Router
- Vite for build tooling
- Tailwind CSS for styling
- Nginx for serving static files

**Backend:**
- Django 5.2.8
- Django REST Framework
- PostgreSQL 16
- Gunicorn WSGI server

## Prerequisites

- Docker Desktop (Windows/Mac) or Docker Engine + Docker Compose (Linux)
- Git

## Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/LGWillis/Cookbook-Application.git
   cd Cookbook-Application
   ```

2. **Create backend environment file:**
   ```bash
   # Copy the example environment file
   cp backend/.env.example backend/.env
   
   # Or on Windows PowerShell:
   # Copy-Item backend\.env.example backend\.env
   ```

3. **Start all services:**
   ```bash
   docker compose up --build -d
   ```

   This will:
   - Build the frontend and backend images
   - Start PostgreSQL database
   - Run Django migrations
   - Collect static files
   - Start all services in detached mode

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Django Admin: http://localhost:8000/admin

5. **Create a superuser (optional):**
   ```bash
   docker compose exec backend python manage.py createsuperuser
   ```

## Development

### Running Individual Services

**Backend only:**
```bash
docker compose -f docker-compose.backend.yml up --build
```

**Frontend only:**
```bash
docker compose -f docker-compose.frontend.yml up --build
```

### Viewing Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f frontend
docker compose logs -f backend
docker compose logs -f db
```

### Stopping Services

```bash
# Stop all services
docker compose down

# Stop and remove volumes (WARNING: deletes database data)
docker compose down -v
```

### Rebuilding After Changes

```bash
# Rebuild specific service
docker compose build frontend
docker compose up -d frontend

# Rebuild everything
docker compose down
docker compose up --build -d
```

## Project Structure

```
Cookbook-Application/
├── backend/                 # Django backend
│   ├── config/             # Django settings and URLs
│   ├── recipes/            # Recipe app
│   ├── users/              # User authentication
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env               # Environment variables (create from .env.example)
├── frontend/               # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── lib/           # API utilities
│   │   └── assets/
│   ├── Dockerfile
│   ├── nginx.conf         # Nginx configuration
│   └── package.json
├── docker-compose.yml      # Main compose file
└── README.md
```

## Environment Variables

### Backend (.env)

Create `backend/.env` with:

```env
POSTGRES_DB=cookbook
POSTGRES_USER=cookbook
POSTGRES_PASSWORD=cookbook
DJANGO_DEBUG=true
DJANGO_SECRET_KEY=your-secret-key-here
```

### Frontend (Build-time)

The frontend API base URL is configured in `docker-compose.yml`:
```yaml
args:
  VITE_API_BASE: http://localhost:8000
```

## Troubleshooting

### Frontend shows white screen
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Disable browser extensions that inject content (shopping extensions, etc.)
- Check browser console for errors (F12)

### Backend won't start
```bash
# Check logs
docker compose logs backend

# Verify database is running
docker compose ps

# Reset database (WARNING: loses all data)
docker compose down -v
docker compose up -d
```

### Database connection errors
- Ensure PostgreSQL container is healthy: `docker compose ps`
- Check backend logs: `docker compose logs backend`
- Verify environment variables in `backend/.env`

### Port already in use
If ports 3000, 8000, or 5432 are already in use, you can change them in `docker-compose.yml`:
```yaml
ports:
  - "3001:80"  # Change 3000 to 3001 for frontend
```


![CookBook preview](docs/Screenshot%202025-11-12%20212839.png)
