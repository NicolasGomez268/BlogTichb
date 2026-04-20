"""
WSGI file template for PythonAnywhere.

Usage:
1) Copy this file content into your PythonAnywhere WSGI configuration file.
2) Replace <your-pa-username> with your PythonAnywhere username.
3) Update VIRTUALENV_PATH if needed.
"""

import os
import sys
from pathlib import Path

PA_USERNAME = "<your-pa-username>"
PROJECT_PATH = Path(f"/home/{PA_USERNAME}/BlogTichb")
BACKEND_PATH = PROJECT_PATH / "backend"
VIRTUALENV_PATH = f"/home/{PA_USERNAME}/.virtualenvs/blogtichb-env"

if str(BACKEND_PATH) not in sys.path:
    sys.path.insert(0, str(BACKEND_PATH))

# Activate virtualenv site-packages
python_version = f"python{sys.version_info.major}.{sys.version_info.minor}"
site_packages = Path(VIRTUALENV_PATH) / "lib" / python_version / "site-packages"
if site_packages.exists() and str(site_packages) not in sys.path:
    sys.path.insert(0, str(site_packages))

# Production environment variables
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
os.environ.setdefault("DJANGO_DEBUG", "False")
os.environ.setdefault("DJANGO_ALLOWED_HOSTS", f"{PA_USERNAME}.pythonanywhere.com")

from django.core.wsgi import get_wsgi_application  # noqa: E402

application = get_wsgi_application()
