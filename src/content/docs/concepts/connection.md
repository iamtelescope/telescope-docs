---
title: Connection
description: Understand how Connections work in Telescope and how they're used by Sources
---

A **Connection** is an object that defines connection parameters for an external data source, such as a database or container runtime. Connections are separate, reusable entities that can be shared across multiple sources.

## Overview

Connections store the technical details needed to connect to external systems:
- **Host and port information**
- **Authentication credentials**
- **SSL/TLS configuration**
- **Protocol-specific settings**

By separating connections from sources, Telescope enables:
- **Reusability**: One connection can be used by multiple sources
- **Security**: Connection credentials are managed independently
- **Flexibility**: Update connection details without modifying sources
- **Access Control**: Fine-grained permissions on who can use or manage connections

## Connection vs Source

| Aspect | Connection | Source |
|--------|-----------|--------|
| **Purpose** | Technical connectivity | Data structure and access |
| **Contains** | Host, credentials, SSL config | Database/table, field mappings, time field |
| **Reusability** | Can be shared by multiple sources | References one connection |
| **RBAC** | Independent permission model | Independent permission model |

## Supported Connection Types

### ClickHouse Connection

:::warning
**Important**: As of version 0.0.19, Telescope only supports HTTP(S) connections to ClickHouse. The native protocol is no longer supported.
:::

ClickHouse connections use the [clickhouse-connect](https://clickhouse.com/docs/en/integrations/language-clients/python/intro) Python library, which communicates exclusively over HTTP(S) protocol.

**Parameters:**
- **`host`** – ClickHouse server host (e.g., `localhost`)
- **`port`** – HTTP(S) port (default: `8123` for HTTP, `8443` for HTTPS)
- **`user`** – Username for authentication
- **`password`** – Password for authentication
- **`ssl`** – Enable HTTPS connection

**SSL Options** (when SSL is enabled):
- **`verify`** – Whether to validate certificates (default: True)
- **`ca_certs`** – CA certificate file path
- **`certfile`** – Client certificate file
- **`keyfile`** – Client key file
- **`server_hostname`** – SNI hostname for SSL
- **`alt_hosts`** – Alternative hosts for failover

### Docker Connection

Docker connections enable log streaming from Docker containers.

**Parameters:**
- **`address`** – Docker daemon socket URL
  - Local: `unix:///var/run/docker.sock`
  - Remote: `tcp://<host>:<port>`

### Kubernetes Connection

Kubernetes connections enable log querying from pods and containers via the Kubernetes API.

**Parameters:**
- **`Use local file path instead of content`** – Toggle to choose between local file path or inline content
  - When enabled: Use local file path (requires `Kubeconfig file path`)
  - When disabled: Provide kubeconfig content inline (requires `Kubeconfig Yaml Content`)
- **`Context FlyQL Filter`** – FlyQL expression to filter available contexts
  - Example: `name ~ "prod.*"` to include only production contexts
  - Leave empty to include all contexts from the kubeconfig
- **`Max Concurrent Requests`** – Maximum number of concurrent API requests per context (default: 20)
  - Controls parallelism when fetching logs from multiple pods
  - Each context will have at most N parallel requests

## Connection Lifecycle

1. **Creation**: Administrator or authorized user creates a connection
2. **Testing**: Connection credentials are validated
3. **Usage**: Sources reference the connection
4. **Sharing**: Connection permissions grant access to users/groups
5. **Updates**: Connection parameters can be modified
6. **Deletion**: Only possible if no sources are using it

## Connection Permissions

See [Authentication & Authorization](/concepts/auth#connection-roles) for detailed permission model.

## Managing Connections

- **Create**: Via UI at `/connections/new`
- **List**: View available connections at `/connections`
- **Edit**: Modify connection parameters at `/connections/:id/edit`
- **Access Control**: Manage who can use the connection
- **Delete**: Remove unused connections (blocked if in use by sources)

## Best Practices

1. **Naming**: Use descriptive names indicating environment (e.g., "Production ClickHouse", "Staging Docker")
2. **Security**:
   - Use separate connections for different security contexts
   - Enable SSL/TLS for production connections
   - Regularly rotate credentials
3. **Reusability**: Create connections at the appropriate scope (team, project, environment)
4. **Access Control**: Grant minimum required permissions
5. **Documentation**: Use the description field to note important details

## Related Concepts

- [Source](/concepts/source) – Uses connections to access data
- [Authentication & Authorization](/concepts/auth) – Connection permission model
