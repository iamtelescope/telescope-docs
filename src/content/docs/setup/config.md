---
title: Config file options
description: TODO
---


With the configuration file, you can control certain aspects of the Telescope instance's operation.
The `TELESCOPE_CONFIG_FILE` variable specifies the configuration file that is used.

Please check the [config.py](https://github.com/iamtelescope/telescope/blob/main/backend/telescope/config.py) to get a detailed view of the default values used in the configuration and how they are merged with the values from the configuration files.

```yaml
auth:
  providers:
    github:
      # Enable or disable login via GitHub
      enabled: false
      # Add users to the specified group on login (the group must exist)
      default_group: null
      # client_id, key, and secret should be obtained from GitHub (https://docs.allauth.org/en/dev/socialaccount/providers/github.html)
      client_id: ''
      key: ''
      secret: ''
      # If specified, users must belong to one of these organizations to log in.
      organizations: []
    okta:
      # Enable or disable login via Okta
      enabled: false
      # Okta OAuth client ID
      client_id: ''
      # Okta OAuth client secret
      secret: ''
      # Okta base URL (e.g., https://yourcompany.okta.com)
      base_url: ''
      # Add users to the specified group on login (the group must exist)
      default_group: null
      # OAuth scopes to request (space-separated)
      scope: 'openid profile email'
      # Enable PKCE (Proof Key for Code Exchange) for enhanced security
      pkce_enabled: true
  # Force authentication through a specific provider ('github' or 'okta')
  # When set, the login page will automatically redirect to the specified provider
  force_auth_provider: null
  # Secret URL path for emergency local login when forced auth is enabled
  # Example: Setting this to "emergency-abc123" creates the URL /login/emergency-abc123
  # This URL bypasses forced authentication and shows the local login form
  local_login_secret_path: null
  # If set to true, the user is always authenticated without any conditions
  enable_testing_auth: false
  # If enable_testing_auth is set true, defines the username of the logged-in user
  testing_auth_username: telescope

django:
  CSRF_TRUSTED_ORIGINS:
  - http://localhost:9898
  DATABASES:
    default:
      ENGINE: django.db.backends.sqlite3
      NAME: telescope-default-db.sqlite3
  # Django cache configuration - supports any cache backend supported by Django
  # See https://docs.djangoproject.com/en/stable/topics/cache/ for available options
  CACHES:
    default:
      BACKEND: django.core.cache.backends.db.DatabaseCache
      LOCATION: telescope_cache
      # Alternative: In-memory cache (faster, but not shared across workers)
      # BACKEND: django.core.cache.backends.locmem.LocMemCache
      # Alternative: Redis cache (requires redis-py package)
      # BACKEND: django.core.cache.backends.redis.RedisCache
      # LOCATION: redis://127.0.0.1:6379/1
  DEBUG: false

gunicorn:
  bind: 127.0.0.1:9898
  max_requests: 50
  max_requests_jitter: 50
  timeout: 120
  workers: 8

limits:
  # Specifies the maximum number of saved views a single user can create. If set to `0`, the limit is disabled and users can create unlimited views.
  max_saved_views_per_user: 0
  
frontend:
    show_github_url: true  # show or not github url on top panel
    github_url: ""
    show_docs_url: true  # show or not docs url on top panel
    docs_url: ""
    base_url: "" # base url path ie "/telescope"

logging:
  # Options: default, dev, or json
  format: default
  # Setup for log levels of different handlers
  levels:
    all: DEBUG
    django: DEBUG
    django.request: DEBUG
    django.template: INFO
    django.utils.autoreload: INFO
    telescope: DEBUG
```
