---
title: Source configuration
description: Learn how to create and configure sources using existing connections in Telescope.
---

Sources define how to access and interpret data from external systems. To create a source, you reference an existing [Connection](/concepts/connection) and add data-specific configuration on top.

## Creating a source

The source creation wizard consists of five steps:

### Step 1: Connection

Choose an existing connection from the dropdown list. Only connections you have `connection_use` permission for will appear.

:::tip
If you don't see a connection you need, ask a connection owner or Global Admin to grant you `connection_use` permission, or create a new connection at **Connections → New**.
:::

For **ClickHouse connections**, specify which database and table to use:
- **`database`** – Database name
- **`table`** – Table name

For **Docker connections**, no additional configuration is needed.

### Step 2: Fields setup

Add and configure fields for your source.

Click **"Autoload fields"** to automatically load field definitions from the database schema (ClickHouse only). This is the recommended approach as it ensures field types are correct.

For manual field configuration or Docker sources, click **"Add Field"** to add fields one by one.

### Step 3: Field mapping

Configure which fields have special roles:

- **`Time field`** – Used for filtering logs by time range. Should match your ClickHouse table's partition key for optimal performance (required)
- **`Date field`** – Additional date field if your schema separates date and time
- **`Severity field`** – Used to apply different colors to message bars based on severity and as a default field for graph grouping
  :::note
  This setting is **disabled for Docker sources**, which do not support severity highlighting.
  :::
- **`Default chosen fields`** – Fields shown by default in the results table (required)

### Step 4: Naming

- **`slug`** – A unique [slug](https://docs.djangoproject.com/en/5.1/ref/forms/fields/#slugfield) identifier. Cannot be changed after creation (used as a human-readable source identifier).
- **`name`** – Human-readable source name (e.g., "Production App Logs", "Staging API Logs").
- **`description`** – Optional description explaining what data this source provides.

### Step 5: Review and create

Review all your configuration and click **"Create"** (or **"Save"** when editing) to finalize the source.

### Field properties

Each field has several properties:

- **`Name`** – Field name in the database table
- **`Display Name`** – Field name shown in the data explorer
- **`Type`** – The field type, based on the ClickHouse data type. If the schema is loaded automatically, this type is derived directly from ClickHouse. When adding fields manually, users can select a type from a predefined list or enter it manually. Currently, the type is primarily used to determine which fields can be selected as the **`Time field`** (only fields containing `datetime` are eligible).
- **`Treat as JSON String`** – A boolean property that defines whether this field should be treated as a JSON object in the result. If set to `true`, the server will convert the string into a JSON object. If set to `false`, the value will remain a string and will be displayed as such in the UI.
- **`Autocomplete`** – A boolean property that defines whether this field should use autocompletion in the query input.
- **`Suggest`** – A boolean property that defines whether this field should be suggested in the query input.
- **`Values`** – A comma-separated list of predefined field values. This field is used only for the `enum` type. It allows specifying a fixed set of values for a particular field, ensuring that only valid options are used. This is particularly useful for `enum` types, as it helps prevent sending requests with incorrect data.

## Editing sources

To edit a source, navigate to its detail page and click **"Edit"**.

:::warning
**Connection kind restriction**: When editing a source, you cannot change to a connection of a different kind. The connection selector will only show connections matching the source's current connection kind (ClickHouse or Docker).
:::

For example:
- If a source uses a ClickHouse connection, you can only select other ClickHouse connections
- If a source uses a Docker connection, you can only select other Docker connections

This ensures that the source configuration remains consistent with the connection type.

## Viewing source details

The source detail page displays:

- **Source information**
  - Kind (with icon), slug, name, description
  - Connection information (name, link to connection detail page)
  - Database and table (for ClickHouse sources)

- **Field configuration**
  - Complete list of configured fields
  - Time field and severity field settings

- **Access control**
  - List of users and groups with access to this source
  - Their assigned roles (Owner, Editor, Viewer, User, Raw Query User)

## Source permissions

Sources use Role-Based Access Control (RBAC) independent from their underlying connection. See [Source Roles](/concepts/auth#source-roles) for details.

### Permission requirements

| What You Want to Do | Required Permissions |
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

3. **Field configuration**
   - Only expose fields needed for log analysis
   - Use **"Autoload fields"** when possible to ensure accuracy
   - Use the time/date field that matches your ClickHouse table's partition key for optimal query performance
   - Configure severity field if your logs have severity/level information

4. **Access control**
   - Grant minimum required permissions
   - Use `source_use` role for team members who need to query logs
   - Restrict `source_raw_query` to trusted users only

## Related concepts

- [Connection configuration](/ui/connection) – How to create and manage connections
- [Source](/concepts/source) – Technical details about sources
- [Authentication & Authorization](/concepts/auth) – Permission model details