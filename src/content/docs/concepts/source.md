---
title: Source
description: Understand how Sources work in Telescope and their relationship with Connections
---

A **Source** is an object that defines how to access and interpret data from an external system. Sources reference [Connections](/concepts/connection) for connectivity and add data-specific configuration on top.

While a [Connection](/concepts/connection) handles the technical connectivity (host, credentials, SSL), a Source defines:
- **Which data to access** (database, table, container filters)
- **Column mappings** (which columns to query, their types, display names)
- **Special column roles** (time column, severity column)
- **Query capabilities** (autocomplete, suggestions, raw queries)
- **Access permissions** (who can read/use/edit the source)

## Source components

### Connection Reference

Every source references exactly one connection. The connection provides:
- Technical connectivity parameters
- Authentication credentials
- Protocol configuration

:::note
For ClickHouse sources, the database and table are specified in the **Source** configuration, not in the Connection. This allows multiple sources to use the same connection while accessing different databases or tables.
:::

### Data Location (ClickHouse)

For ClickHouse sources:
- **`database`** – Which database to query
- **`table`** – Which table contains the data

### Column Configuration

Sources define which columns from the underlying data should be exposed:
- Column names and display aliases
- Data types
- Autocomplete and suggestion settings
- JSON string handling
- Enum values

### Special Columns

- **Time Column** – Used for time-range queries in the explorer
- **Severity Column** – Used for colored log bars and default grouping
- **Default Chosen Columns** – Columns shown by default in results

## Source Types

### ClickHouse Source

Uses a ClickHouse connection to query log data from ClickHouse tables.

**Requirements:**
- ClickHouse connection (HTTP/HTTPS protocol only)
- Database and table specification
- Time column for temporal queries

For ClickHouse connections, Telescope uses the [clickhouse-connect](https://clickhouse.com/docs/en/integrations/language-clients/python/intro) Python library, which communicates exclusively over HTTP(S) protocol. As of version 0.0.19, the native protocol (previously supported via clickhouse-driver) is no longer supported.

### Docker Source

*Since v0.0.15*

Uses a Docker connection to stream logs from containers.

**Requirements:**
- Docker connection (local or remote socket)
- Predefined column set (cannot be customized)

**Limitations:**
- Column list is fixed
- No column customization

:::note[Log message structure]
Docker container logs arrive as plain text strings. Telescope normalizes them by wrapping each log line in a JSON structure with a `body` column containing the original log message. For example, the log string `[ERROR] Connection failed` becomes `{"body": "[ERROR] Connection failed"}`. This normalization allows [Severity Rules](/concepts/severity-rules) to extract severity from the message text using JSON paths or regex patterns.
:::

### Kubernetes Source

*Since v0.0.24*

Uses a Kubernetes connection to query logs from pods and containers via the Kubernetes API.

**Requirements:**
- Kubernetes connection (kubeconfig-based authentication)
- Context and namespace selection
- Pod filtering configuration

**Features:**
- Multi-context and multi-namespace support
- Advanced pod filtering (label selectors, field selectors, FlyQL filters)
- Rich metadata (pod labels, container names, node information)
- Predefined column set with Kubernetes-specific metadata

:::note[Log message structure]
Kubernetes pod logs arrive as plain text strings from the Kubernetes API. Similar to Docker sources, Telescope normalizes them by wrapping each log line in a JSON structure with a `body` column containing the original message. This allows [Severity Rules](/concepts/severity-rules) to extract severity from the log text.
:::

See the [Kubernetes Setup Guide](/howto/kubernetes) for detailed setup instructions.

## Source as RBAC Entity

Sources act as independent RBAC entities, allowing fine-grained access control:
- Assign roles to users and groups
- Control who can read, edit, use, or delete the source
- Grant raw query permissions independently
- Manage access separately from the underlying connection

See [Source Roles](/concepts/auth#source-roles) for details.

## Connection vs Source Permissions

Both Connections and Sources have independent permission models:

| Permission Level | Controls | Example |
|-----------------|----------|---------|
| **Connection** | Who can use the connection in sources | Alice can create sources using "Prod DB" connection |
| **Source** | Who can query data from the source | Bob can query logs but can't edit source configuration |

A user needs:
1. **Connection USE permission** – To create a source using that connection
2. **Source READ/USE permission** – To query logs from that source

## Relationship Diagram

```
Connection (Prod ClickHouse)
    ├── host: clickhouse.prod.com
    ├── credentials: ***
    └── ssl: enabled
         │
         ├─> Source A (Application Logs)
         │   ├── database: logs_db
         │   ├── table: app_logs
         │   └── fields: timestamp, level, message...
         │
         └─> Source B (Audit Logs)
             ├── database: audit_db
             ├── table: audit_trail
             └── fields: event_time, user_id, action...
```

## Source Lifecycle

1. **Creation**: User selects a connection they have USE access to
2. **Configuration**: Specify database/table and field mappings
3. **Validation**: Test connection and optionally load schema
4. **Usage**: Query logs through the explorer
5. **Updates**: Modify configuration (requires EDIT permission)
6. **Deletion**: Remove source (does not delete the connection)

## Best Practices

1. **Naming**: Use descriptive names indicating data type (e.g., "Production App Logs", "Staging API Logs")
2. **Field Selection**: Only expose fields needed for log analysis
3. **Time Field**: Use the time/date field that matches your ClickHouse table's partition key for optimal query performance
4. **Severity Field**: Configure if your logs have severity/level information
5. **Connection Reuse**: Share connections across sources when appropriate
6. **Access Control**: Grant minimum required permissions

## Related Concepts

- [Connection](/concepts/connection) – Technical connectivity layer
- [Authentication & Authorization](/concepts/auth) – Permission model
- [Querying](/concepts/querying) – How to query data from sources
