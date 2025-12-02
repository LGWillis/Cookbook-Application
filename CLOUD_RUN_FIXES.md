# Cloud Run Deployment Fixes

## Issues Found & Fixed

### 1. **Port Binding Not Respecting Environment Variable**
- **Problem**: Dockerfile hardcoded port 8000, but Cloud Run uses `PORT` env var
- **Fix**: Updated entrypoint.sh to use `${PORT:-8000}` for dynamic port binding
- **File**: `backend/entrypoint.sh`

### 2. **Missing Health Check**
- **Problem**: Cloud Run couldn't determine if container was healthy
- **Fix**: Added HEALTHCHECK directive to Dockerfile
- **File**: `backend/Dockerfile`

### 3. **Verbose Logging Issues**
- **Problem**: gunicorn wasn't outputting sufficient logs for Cloud Run to diagnose issues
- **Fix**: Enhanced logging with debug level and detailed access logs
- **File**: `backend/entrypoint.sh`

### 4. **Database Connection Timeout**
- **Problem**: Migration failures weren't being caught properly
- **Fix**: Better error handling for database checks with retry logic
- **File**: `backend/entrypoint.sh`

### 5. **Static Files Collection**
- **Problem**: Static file failures would silently continue
- **Fix**: Added `--clear` flag and better error messages
- **File**: `backend/entrypoint.sh`

### 6. **Django Configuration for Cloud Run**
- **Problem**: ALLOWED_HOSTS and SSL settings not configured for Cloud Run
- **Fix**: Added Cloud Run-specific settings with environment variable check
- **File**: `backend/config/settings.py`

## Files Modified

1. **backend/entrypoint.sh** - Complete rewrite with better error handling
2. **backend/Dockerfile** - Added health check, optimized environment variables
3. **backend/config/settings.py** - Added Cloud Run security settings and logging

## Deployment Checklist

Before deploying to Cloud Run, ensure you set these environment variables in your gcloud run deploy command:

```bash
gcloud run deploy cookbook-backend \
  --image YOUR_IMAGE \
  --platform managed \
  --region YOUR_REGION \
  --allow-unauthenticated \
  --port 8000 \
  --timeout 300s \
  --update-env-vars="\
    DJANGO_SETTINGS_MODULE=config.settings,\
    DJANGO_DEBUG=False,\
    DJANGO_ENVIRONMENT=cloud-run,\
    PYTHONUNBUFFERED=True,\
    DATABASE_URL=YOUR_DATABASE_URL,\
    FRONTEND_ORIGIN=YOUR_FRONTEND_URL,\
    DJANGO_ALLOWED_HOSTS=YOUR_DOMAIN" \
  --labels="commit_sha=YOUR_SHA"
```

## Key Changes Explained

### Entrypoint Script
- Uses bash instead of sh for better compatibility
- Respects the `PORT` environment variable (Cloud Run requirement)
- Better database connectivity checks
- Enhanced logging at debug level
- Proper error handling with warnings that don't stop execution

### Dockerfile
- Added health check endpoint
- Environmental variable handling
- Set default PORT=8000
- Installed postgresql-client for database debugging

### Django Settings
- Cloud Run detection via `DJANGO_ENVIRONMENT` env var
- Automatic security headers for Cloud Run
- Structured logging support
- Flexible ALLOWED_HOSTS configuration

## Troubleshooting

If deployment still fails:

1. **Check Cloud Run logs**:
   ```bash
   gcloud run logs read cookbook-backend --limit 50
   ```

2. **Verify database connectivity**:
   - Ensure DATABASE_URL is accessible from Cloud Run
   - Check VPC/firewall rules

3. **Check environment variables**:
   - Ensure all required env vars are set
   - Verify DJANGO_SETTINGS_MODULE is correct

4. **Monitor startup time**:
   - First deployment takes longer due to migrations
   - Subsequent deployments should be faster

## Expected Startup Logs

When deployment succeeds, you should see:
```
=== Starting Django Application ===
✓ DATABASE_URL is configured
✓ Database is reachable
✓ Migrations completed successfully
✓ Static files collected
✓ Django initialized successfully
================================
Starting Gunicorn on 0.0.0.0:8000
================================
[timestamp] [gunicorn] Starting gunicorn [PID]
```
