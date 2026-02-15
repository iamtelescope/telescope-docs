---
title: Connection configuration
description: Learn how to create, manage, and configure connections in Telescope
---

Connections are reusable objects that store technical connectivity details for external systems like databases and container runtimes. Once created, connections can be shared across multiple sources.

## Creating connections

Telescope supports several types of connections, each with different configuration requirements:

- **[ClickHouse connection](/ui/connection/clickhouse)**
- **[Kubernetes connection](/ui/connection/kubernetes)**
- **[Docker connection](/ui/connection/docker)**

## Viewing connections

The connections list page shows all connections you have access to view. Each connection card displays:

- Connection name
- Connection kind (with icon)
- Description
- Number of sources using this connection

## Editing connections

To edit a connection, click the connection name to view its details, then click **"Edit"**.

:::note[Impact on sources]
Editing connection parameters will affect all sources that use this connection. Changes take effect immediately.
:::

## Connection details page

The connection detail page displays:

- **Connection information**
  - Kind, name, description
  - Connection parameters (credentials are hidden)

- **Access control**
  - List of users and groups with access to this connection
  - Their assigned roles (Owner, Editor, Viewer, User)

## Deleting connections

To delete a connection, navigate to its detail page and click **"Delete"**.

:::danger[Cannot delete connections in use]
**Important**: You cannot delete a connection that is being used by any sources. You must first delete or reconfigure all dependent sources before the connection can be deleted.

If you attempt to delete a connection in use, you'll see an error message indicating how many sources are using it.
:::

## Connection permissions

Connections use Role-Based Access Control (RBAC). See [Connection roles](/concepts/auth#connection-roles) for details.

### Permission requirements

| What you want to do | Required permission |
|---------------------|-------------------|
| View connection list | `connection_read` |
| Create a new connection | `global_create_connection` (Global Admin only) |
| Edit connection parameters | `connection_edit` |
| Use connection when creating sources | `connection_use` |
| Delete connection | `connection_delete` (only if not in use) |
| Grant access to others | `connection_grant` |

:::note[Creating sources]
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
   - Always enable SSL/TLS for production connections
   - Verify SSL certificates in production
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

## Related documentation

- [Connection concepts](/concepts/connection) – Technical details about connections
- [Source configuration](/ui/source) – How to create sources using connections
- [Authentication & authorization](/concepts/auth) – Permission model details
