---
title: Running Telescope behind a reverse proxy at a subpath
description: How to configure Telescope to run under a URL subpath using the base_url setting
---

By default, Telescope expects to be served at the root path (`/`). If you need to run it under a URL subpath - for example `https://example.com/telescope/` - use the `base_url` setting.

:::note
`base_url` support was fixed in version **0.0.25**. Earlier versions had issues with internal API calls not respecting the configured subpath.
:::

## Config changes

In your `config.yaml`, set `base_url` under the `frontend` section and add your domain to `CSRF_TRUSTED_ORIGINS` and `ALLOWED_HOSTS`:

```yaml
frontend:
  base_url: "/telescope"

django:
  CSRF_TRUSTED_ORIGINS:
    - "https://example.com"
  ALLOWED_HOSTS:
    - "example.com"
```

The `base_url` value should start with `/` and have no trailing slash.

## Reverse proxy example configuration

While there are many options for a reverse proxy, the most common is nginx. Here is an example configuration:

```nginx
location /telescope/ {
    proxy_pass http://127.0.0.1:9898/;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

Note the trailing slash on both `location /telescope/` and `proxy_pass` - this tells nginx to strip the `/telescope` prefix when forwarding requests to the backend.

## How it works

When `base_url` is set, Telescope:

- Sets Django's `FORCE_SCRIPT_NAME` to the configured value, so all URL reversals are prefixed correctly.
- Injects the base path into the HTML `<base href>` tag, which Vue Router uses to prefix all frontend routes.
- Adjusts login and redirect URLs to include the subpath.
