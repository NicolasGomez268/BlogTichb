# Deploy Guide

## 1) Backend on PythonAnywhere (Django API)

### Upload code
- Push your repository to GitHub.
- In PythonAnywhere Bash console:
  - `git clone <your-repo-url>`
  - `cd BlogTichb/backend`

### Create and prepare virtualenv
- `mkvirtualenv --python=/usr/bin/python3.11 blogtichb-env`
- `workon blogtichb-env`
- `pip install -r requirements.txt`

### Environment variables
- In PythonAnywhere Web app -> WSGI file, set env vars before `get_wsgi_application()`:
  - `DJANGO_SECRET_KEY`
  - `DJANGO_DEBUG=False`
  - `DJANGO_ALLOWED_HOSTS=<yourusername>.pythonanywhere.com`
  - `DJANGO_CORS_ALLOWED_ORIGINS=https://<your-vercel-domain>`
  - `DJANGO_CSRF_TRUSTED_ORIGINS=https://<yourusername>.pythonanywhere.com,https://<your-vercel-domain>`

You can use `backend/.env.example` as reference.

### Migrate and collect static
- In PythonAnywhere Bash console:
  - `cd ~/BlogTichb/backend`
  - `python manage.py migrate`
  - `python manage.py collectstatic --noinput`
  - `python manage.py createsuperuser` (optional)

### Web app settings in PythonAnywhere
- Source code: `/home/<yourusername>/BlogTichb/backend`
- WSGI file: use content from `backend/pythonanywhere_wsgi.py` as base.
- Static files mapping:
  - URL: `/static/` -> Directory: `/home/<yourusername>/BlogTichb/backend/staticfiles`
  - URL: `/media/` -> Directory: `/home/<yourusername>/BlogTichb/backend/media`

### Reload app
- Click Reload in Web tab.
- Test API:
  - `https://<yourusername>.pythonanywhere.com/api/articles/`

## 2) Frontend on Vercel (React + Vite)

### Vercel project setup
- Import repository in Vercel.
- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`

### Environment variable in Vercel
- Add:
  - `VITE_API_BASE_URL=https://<yourusername>.pythonanywhere.com/api`

### SPA routing
- `frontend/vercel.json` is included for rewrite to `index.html`.

### Deploy
- Trigger deploy from Vercel dashboard.
- Open deployed URL and verify:
  - Home loads.
  - Login works.
  - News list and detail fetch from PythonAnywhere API.

## 3) CORS quick checklist
- Backend `DJANGO_CORS_ALLOWED_ORIGINS` must include your exact Vercel URL.
- If you use a custom domain in Vercel, add it too.
- After CORS changes, reload PythonAnywhere app.
