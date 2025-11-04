---
title: Connection configuration
description: Learn how to create, manage, and configure connections in Telescope.
---

Connections are reusable objects that store technical connectivity details for external systems like databases and container runtimes. Once created, connections can be shared across multiple sources.

## Creating a connection

To create a new connection, navigate to **Connections → New** or click the **"New connection"** button on the connections list page.

The connection creation wizard consists of three steps:

### Step 1: Connection kind

Select the type of connection you want to create:

- **ClickHouse** – For connecting to ClickHouse databases
- **Docker** – For connecting to Docker daemon sockets

### Step 2: Connection parameters

Fill in the connection parameters based on the selected kind.

#### ClickHouse connection

:::warning
**Important**: As of version 0.0.19, Telescope only supports HTTP(S) connections to ClickHouse. The native protocol is no longer supported.
:::

- **`host`** – ClickHouse server host (e.g., `localhost` or `clickhouse.prod.com`)
- **`port`** – HTTP(S) port. Defaults to `8123` for HTTP or `8443` for HTTPS. **Note**: The native protocol port (9000) is no longer supported.
- **`user`** – Username for authentication. Defaults to `default`.
- **`password`** – Password for authentication.
- **`ssl`** – Enable to use HTTPS connection.

**SSL Options** (when SSL is enabled):
- **`Verify`** – Whether to validate SSL certificates. Defaults to `True`.
- **`CA Certs`** – Path to CA certificate file for certificate verification.
- **`Cert file`** – Path to client certificate file for mutual TLS authentication.
- **`Key file`** – Path to client private key file.
- **`Server hostname`** – SNI hostname for SSL handshake. Useful when connecting through SSH tunnels.
- **`Alt hosts`** – Comma-separated list of alternative hosts for failover.

:::tip
Click **"Test connection"** to verify your connection parameters before proceeding. A successful test will show a green checkmark.
:::

#### Docker connection

- **`address`** – Docker daemon socket URL
  - Local: `unix:///var/run/docker.sock`
  - Remote: `tcp://<host>:<port>`

### Step 3: Connection details

- **`name`** – Connection name (e.g., "Production ClickHouse", "Staging Docker").
- **`description`** – Optional description explaining the connection's purpose or environment.

## Viewing connections

The connections list page shows all connections you have access to view. Each connection card displays:

- Connection name
- Connection kind (with icon)
- Description
- Number of sources using this connection
- Your permission level

You can filter connections by:
- **Search** – Filter by name
- **Kind** – Show only ClickHouse or Docker connections

## Editing connections

To edit a connection, click the connection name to view its details, then click **"Edit"**.

:::warning
Editing connection parameters will affect all sources that use this connection. Changes take effect immediately.
:::

## Connection details page

The connection detail page displays:

- **Connection information**
  - Kind, name, description
  - Connection parameters (credentials are hidden)

- **Sources using this connection**
  - List of all sources referencing this connection
  - Links to source detail pages

- **Access control**
  - List of users and groups with access to this connection
  - Their assigned roles (Owner, Editor, Viewer, User)

## Deleting connections

To delete a connection, navigate to its detail page and click **"Delete"**.

:::danger
**Important**: You cannot delete a connection that is being used by any sources. You must first delete or reconfigure all dependent sources before the connection can be deleted.

If you attempt to delete a connection in use, you'll see an error message indicating how many sources are using it.
:::

## Connection permissions

Connections use Role-Based Access Control (RBAC). See [Connection Roles](/concepts/auth#connection-roles) for details.

### Common permission scenarios

| What You Want to Do | Required Permission |
|---------------------|-------------------|
| View connection list | `connection_read` |
| Create a new connection | `global_create_connection` (Global Admin only) |
| Edit connection parameters | `connection_edit` |
| Use connection when creating sources | `connection_use` |
| Delete connection | `connection_delete` (only if not in use) |
| Grant access to others | `connection_grant` |

:::note
To create a source using a connection, you need:
1. **`global_create_source`** permission (or be Global Admin)
2. **`connection_use`** permission on the specific connection

Connection owners don't automatically have `global_create_source` permission.
:::

## Managing connection access

If you have the `connection_grant` permission, you can manage who has access to the connection:

1. Navigate to the connection detail page
2. Scroll to the **Access control** section
3. Click **"Grant access"**
4. Select users or groups and assign roles:
   - **Owner** – Full control (read, edit, delete, use, grant)
   - **Editor** – Can read, edit, and delete
   - **Viewer** – Can only view connection details
   - **User** – Can view and use connection in sources

## Best practices

1. **Naming conventions**
   - Include environment in name (e.g., "Production ClickHouse", "Staging Docker")
   - Use clear, descriptive names that indicate purpose and environment

2. **Security**
   - Always enable SSL for production connections
   - Verify SSL certificates (`Verify: True`)
   - Use separate connections for different environments
   - Regularly rotate credentials
   - Grant minimum required permissions

3. **Reusability**
   - Create connections at appropriate scope (team, project, environment)
   - Share connections across sources accessing the same system
   - Document connection purpose in description field

4. **Access control**
   - Grant `connection_use` to teams that need to create sources
   - Restrict `connection_edit` and `connection_delete` to administrators
   - Use groups for easier permission management

## Related concepts

- [Connection](/concepts/connection) – Technical details about connections
- [Source configuration](/ui/source) – How to create sources using connections
- [Authentication & Authorization](/concepts/auth) – Permission model details
