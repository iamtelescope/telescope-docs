---
title: Database migrations
description: How to run database migrations when upgrading Telescope
---

Telescope uses [Django's migration system](https://docs.djangoproject.com/en/stable/topics/migrations/) to manage database schema changes. When a release includes a **"Migration required"** note in the [changelog](/changelog), you need to apply pending migrations after updating to the new version.

## Django migration commands

```sh
# View all pending migrations
python manage.py showmigrations

# View only Telescope migrations
python manage.py showmigrations telescope

# Apply all pending migrations
python manage.py migrate
```

## By installation type

:::note
The examples below use paths from the [quickstart guide](/#quickstart). If you are using a custom configuration, adjust the `TELESCOPE_CONFIG_FILE` path and volume mounts to match your setup - the core command is always `python manage.py migrate`.
:::

### Helm

No action required. The Helm chart includes a migration init container that runs `python manage.py migrate` automatically before Telescope starts. Migrations are applied on every deployment.

If you want to disable this behavior, set `initContainers.migrations.enabled: false` in your `values.yaml`.

### Docker

After pulling the new image, run migrations using a one-off container before (or instead of) restarting your main container:

```sh
docker run --rm \
  -e TELESCOPE_CONFIG_FILE=/config.yaml \
  -v $(realpath ~/.telescope/config.yaml):/config.yaml \
  -v $(realpath ~/.telescope/db.sqlite3):/db.sqlite3 \
  ghcr.io/iamtelescope/telescope:<version> \
  python manage.py migrate
```

Adjust the volume mounts to match your actual config and database paths. If you are using PostgreSQL or another external database, the `-v` mount for the database file is not needed.

If your container is already running, you can exec into it instead:

```sh
docker exec -it -e TELESCOPE_CONFIG_FILE=/path/to/config.yaml <container_name> python manage.py migrate
```

### Raw Python

Activate your virtual environment, set the config file path, and run:

```sh
source venv/bin/activate
export TELESCOPE_CONFIG_FILE=/path/to/config.yaml
cd backend
python manage.py migrate
```
