---
title: Source configuration
description: Learn how to create and configure sources using existing connections in Telescope
---

Sources define how to access and interpret data from external systems. To create a source, you reference an existing [Connection](/concepts/connection) and add data-specific configuration on top.

## Source types

Telescope supports several types of sources, each with different configuration requirements:

- **[ClickHouse source](/ui/source/clickhouse)**
- **[Kubernetes source](/ui/source/kubernetes)**
- **[Docker source](/ui/source/docker)**

## Common concepts

### Connections

All sources require an existing connection. You must have `connection_use` permission on the connection to create a source using it.

See [Connection configuration](/ui/connection) for setup instructions.

### Severity rules (Docker/Kubernetes only)

*Since v0.0.24*

Docker and Kubernetes sources support **severity rules** to extract and normalize severity from log message bodies.

**UI overview:**

The severity rules editor has two sections:

#### Extraction rules

Define rules to extract severity from the log message body. Click **"Add Rule"** to create a new extraction rule.

For each rule, configure:

- **Rule type**: Choose the extraction method
  - **Field** – Extract from JSON structure using comma-separated path
  - **Regex** – Extract using regular expression pattern matching

**For Field rules:**
- **Path** – Comma-separated path to the severity column (e.g., `level` or `log,level`)
  - Each path segment navigates one level deeper in the JSON structure
  - Example: `log,level` accesses `obj.log.level` in the JSON

**For Regex rules:**
- **Regex pattern** – Regular expression to match severity (e.g., `\[(\w+)\]`)
- **Capture group** – Which capture group to extract (0 = full match, 1+ = capture groups)
- **Case-insensitive** – Toggle to ignore case when matching pattern

**Evaluation order:**
Extraction rules are evaluated top-to-bottom. The first rule that successfully extracts a value wins, and remaining rules are skipped. Order your rules from most specific to most general.

#### Severity remapping

Map extracted values to normalized severity levels. Click **"Add Mapping"** to create a new remapping rule.

For each mapping, configure:

- **Pattern** – Regex pattern to match the extracted value (e.g., `warn.*` matches "warn", "warning", "WARN")
- **Severity level** – Dropdown with color-coded standard levels:
  - UNKNOWN (gray), FATAL (red), ERROR (red), CRITICAL (orange), WARN (yellow), INFO (blue), DEBUG (green), TRACE (gray)
- **Case-insensitive** – Toggle to ignore case when matching pattern

**Evaluation order:**
Remap rules are also evaluated top-to-bottom. The first pattern that matches wins. If no pattern matches, the extracted value is used as-is.

**Example configuration:**

Here's a simple configuration for JSON logs with nested severity:

**Extraction rules:**
1. Field rule: Path = `log,level`
2. Regex rule: Pattern = `level=(\w+)`, Capture group = 1

**Remap rules:**
1. Pattern = `error`, Value = `ERROR`, Case-insensitive = `true`
2. Pattern = `warn.*`, Value = `WARN`, Case-insensitive = `true`

This configuration:
- First tries JSON extraction from nested `log.level` column
- Falls back to regex extraction from `level=ERROR` format
- Normalizes "error", "Error", "ERROR" to "ERROR"
- Normalizes "warn", "warning", "WARN" to "WARN"

For detailed examples and patterns, see [Severity rules by example](/howto/severity-rules).

## Editing sources

To edit a source, navigate to its detail page and click **"Edit"**.

:::warning[Connection kind restriction]
When editing a source, you cannot change to a connection of a different kind. The connection selector will only show connections matching the source's current connection kind (ClickHouse, Docker, or Kubernetes).
:::

This ensures that the source configuration remains consistent with the connection type.

## Viewing source details

The source detail page displays:

- **Source information**
  - Kind (with icon), slug, name, description
  - Connection information (name, link to connection detail page)
  - Database and table (for ClickHouse sources)

- **Column configuration**
  - Complete list of configured columns
  - Time column and severity column settings

- **Access control**
  - List of users and groups with access to this source
  - Their assigned roles (Owner, Editor, Viewer, User, Raw Query User)

## Source permissions

Sources use Role-Based Access Control (RBAC) independent from their underlying connection. See [Source roles](/concepts/auth#source-roles) for details.

### Permission requirements

| What you want to do | Required permissions |
|---------------------|---------------------|
| View source list | `source_read` on source |
| Create a new source | `global_create_source` AND `connection_use` on connection |
| Edit source configuration | `source_edit` on source |
| Query logs from source | `source_read` AND `source_use` on source |
| Execute raw SQL queries | `source_raw_query` on source |
| Delete source | `source_delete` on source |
| Grant access to others | `source_grant` on source |

:::note
Creating a source requires two permissions:
1. **`global_create_source`** (Global Admin role)
2. **`connection_use`** on the specific connection you want to use

Having `connection_use` alone is not sufficient to create sources.
:::

## Deleting sources

To delete a source, navigate to its detail page and click **"Delete"**.

:::tip
Deleting a source does **not** delete the underlying connection. The connection remains available for other sources or for creating new sources.
:::

## Best practices

1. **Naming**
   - Use descriptive names indicating data type and environment
   - Examples: "Production App Logs", "Staging API Logs", "Audit Trail"

2. **Connection selection**
   - Reuse existing connections when accessing the same system
   - Create separate sources for different databases/tables on the same connection

3. **Column configuration**
   - Only expose columns needed for log analysis
   - Configure severity column/rules if your logs have severity information

4. **Access control**
   - Grant minimum required permissions
   - Use `source_use` role for team members who need to query logs
   - Restrict `source_raw_query` to trusted users only

## Related documentation

- [Source concepts](/concepts/source) – Technical details about sources
- [Connection configuration](/ui/connection) – How to create and manage connections
- [Authentication & authorization](/concepts/auth) – Permission model details
