---
title: Creating a ClickHouse connection
description: Step-by-step guide for creating and configuring ClickHouse connections
---

Learn how to create a ClickHouse connection for accessing ClickHouse databases.

## Prerequisites

- Access to a ClickHouse server with HTTP(S) port enabled
- Database credentials (username and password)
- `global_create_connection` permission (Global Admin role)

:::caution[Protocol requirement]
As of version 0.0.19, Telescope only supports HTTP(S) connections to ClickHouse. The native protocol is no longer supported.
:::

### Step 0: Open form

Navigate to **Connections** → **New**.

### Step 1: Target

Select **ClickHouse** as the connection kind and fill in the connection parameters:

**Basic parameters:**

- **Host** – ClickHouse server host (e.g., `localhost` or `clickhouse.prod.com`)
- **Port** – HTTP(S) port
  - Default: `8123` for HTTP
  - Default: `8443` for HTTPS
  - **Note**: Native protocol port (9000) is no longer supported
- **User** – Username for authentication (defaults to `default`)
- **Password** – Password for authentication

**HTTPS/TLS configuration:**

- **HTTPS enabled** – Toggle to use HTTPS connection instead of HTTP
- **Advanced setup** – Toggle to show additional TLS options:
  - **Verify** – Whether to validate SSL certificates (recommended for production)
  - **CA certificate** – CA certificate content for certificate verification
  - **Client certificate** – Client certificate content for mutual TLS authentication
  - **Client certificate key** – Client certificate private key content
  - **Server host name** – SNI hostname for SSL handshake (useful when connecting through SSH tunnels)
  - **TLS mode** – TLS configuration mode

:::tip[Test before saving]
Click **"Test connection"** to verify your connection parameters before proceeding. A successful test will show a green checkmark.
:::

### Step 2: Naming

- **Name** – Connection name (e.g., "Production ClickHouse", "Staging ClickHouse")
- **Description** – Optional description explaining the connection's purpose or environment

### Step 3: Review & Create

Review your configuration and click **"Create"** to save the connection.

## Best practices

1. **Always enable HTTPS** for production connections
2. **Verify certificates** (`Verify: True`) in production
3. **Test connection** before saving to catch configuration errors early
4. **Use descriptive names** indicating environment (e.g., "Production ClickHouse")
5. **Document purpose** in description field for team clarity

## Security recommendations

- Use separate connections for different environments
- Consider using client certificates (mutual TLS) for enhanced security
- Use HTTPS for all production connections

## Troubleshooting

**Connection test fails:**
- Verify host and port are correct
- Ensure ClickHouse HTTP interface is enabled
- Check firewall rules allow access to HTTP(S) port
- Verify credentials are correct
- For HTTPS connections, check certificate content

**Native protocol error:**
- Telescope no longer supports native protocol (port 9000)
- Use HTTP port 8123 or HTTPS port 8443 instead

## Related documentation

- [ClickHouse connection concept](/concepts/connection#clickhouse-connection) – Technical details
- [Creating a ClickHouse source](/ui/source/clickhouse) – Next step after connection
- [Connection permissions](/ui/connection#connection-permissions) – Managing access
