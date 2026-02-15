---
title: Creating a Docker connection
description: Step-by-step guide for creating and configuring Docker connections
---

Learn how to create a Docker connection for accessing Docker container logs.

## Prerequisites

- Access to a Docker daemon (local or remote)
- Docker socket access or remote API endpoint
- `global_create_connection` permission (Global Admin role)

### Step 0: Open form

Navigate to **Connections** → **New**.

### Step 1: Target

Select **Docker** as the connection kind and fill in the connection parameters:

**Address** – Docker daemon socket URL
- **Local**: `unix:///var/run/docker.sock`
- **Remote**: `tcp://<host>:<port>` (e.g., `tcp://docker-host:2375`)

:::tip[Test before saving]
Click **"Test connection"** to verify access to the Docker daemon before proceeding.
:::

### Step 2: Naming

- **Name** – Connection name (e.g., "Production Docker", "Staging Docker")
- **Description** – Optional description explaining which Docker host this connection accesses

### Step 3: Review & Create

Review your configuration and click **"Create"** to save the connection.

## Best practices

1. **Use local socket** when Telescope runs on the same host as Docker
2. **Secure remote connections** with TLS when connecting to remote Docker daemons
3. **Use descriptive names** indicating which Docker host/environment
4. **Document purpose** in description field
5. **Separate connections** for different environments (prod/staging/dev)

## Security recommendations

- For remote connections, use TLS and client certificates
- Use separate connections for different environments

## Troubleshooting

**Connection test fails:**
- Verify Docker daemon is running
- Check socket path is correct for local connections
- For remote connections, verify host and port are accessible
- Ensure Telescope has permission to access Docker socket
- Check firewall rules for remote connections

**Permission denied:**
- Add Telescope user to `docker` group for local socket access
- Verify socket permissions (`/var/run/docker.sock`)

## Related documentation

- [Docker connection concept](/concepts/connection#docker-connection) – Technical details
- [Creating a Docker source](/ui/source/docker) – Next step after connection
- [Connection permissions](/ui/connection#connection-permissions) – Managing access
