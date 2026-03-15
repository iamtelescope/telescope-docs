---
title: Creating a StarRocks connection
description: Step-by-step guide for creating and configuring StarRocks connections
---

*Since v0.0.26*

Learn how to create a StarRocks connection for accessing StarRocks databases.

## Prerequisites

- Access to a StarRocks cluster with MySQL protocol port enabled
- Database credentials (username and password)
- `global_create_connection` permission (Global Admin role)

:::note[Protocol]
StarRocks uses the MySQL wire protocol for client connections. Telescope connects to StarRocks using the standard MySQL connector.
:::

### Step 0: Open form

Navigate to **Connections** → **New**.

### Step 1: Target

Select **StarRocks** as the connection kind and fill in the connection parameters:

**Basic parameters:**

- **Host** – StarRocks FE (Frontend) server host (e.g., `localhost` or `starrocks-fe.prod.com`)
- **Port** – MySQL protocol port (default: `9030`)
- **User** – Username for authentication (defaults to `root`)
- **Password** – Password for authentication

**TLS configuration:**

- **TLS enabled** – Toggle to use TLS-encrypted connection
- **Advanced setup** – Toggle to show additional TLS options:
  - **Verify** – Whether to validate TLS certificates (recommended for production)
  - **CA certificate** – CA certificate content for certificate verification
  - **Client certificate** – Client certificate content for mutual TLS authentication
  - **Client certificate key** – Client certificate private key content
  - **Server host name** – SNI hostname for TLS handshake (useful when connecting through SSH tunnels)
  - **TLS mode** – TLS configuration mode

:::tip[Test before saving]
Click **"Test connection"** to verify your connection parameters before proceeding. A successful test will show a green checkmark.
:::

### Step 2: Naming

- **Name** – Connection name (e.g., "Production StarRocks", "Staging StarRocks")
- **Description** – Optional description explaining the connection's purpose or environment

### Step 3: Review & Create

Review your configuration and click **"Create"** to save the connection.

## Best practices

1. **Enable TLS** for production connections
2. **Verify certificates** (`Verify: True`) in production
3. **Test connection** before saving to catch configuration errors early
4. **Use descriptive names** indicating environment (e.g., "Production StarRocks")
5. **Document purpose** in description field for team clarity

## Security recommendations

- Use separate connections for different environments
- Consider using client certificates (mutual TLS) for enhanced security
- Enable TLS for all production connections

## Troubleshooting

**Connection test fails:**
- Verify host and port are correct (default MySQL protocol port is `9030`)
- Ensure StarRocks FE node is running and accepting MySQL protocol connections
- Check firewall rules allow access to the MySQL protocol port
- Verify credentials are correct
- For TLS connections, check certificate content

## Related documentation

- [StarRocks connection concept](/concepts/connection#starrocks-connection) – Technical details
- [Creating a StarRocks source](/ui/source/starrocks) – Next step after connection
- [Connection permissions](/ui/connection#connection-permissions) – Managing access
