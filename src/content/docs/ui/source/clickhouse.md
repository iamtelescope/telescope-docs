---
title: Creating a ClickHouse source
description: Step-by-step guide for creating and configuring ClickHouse sources
---

Learn how to create a ClickHouse source to query logs from ClickHouse tables.

## Prerequisites

You need an existing ClickHouse connection with `connection_use` permission. See [Creating a ClickHouse connection](/ui/connection/clickhouse) for setup instructions.

### Step 0: Open form

Navigate to **Sources** → **+Create**.

### Step 1: Connection

Choose an existing ClickHouse connection from the dropdown and configure:

- **Database** – Database name in ClickHouse
- **Table** – Table name containing your logs
- **Query settings** – Optional ClickHouse SETTINGS clause appended to all queries
  - Comma-separated key=value pairs (e.g., `max_threads=4, max_memory_usage=10000000000`)
  - Applied to all queries executed on this source
  - Useful for performance tuning or enforcing query limits
  - See [ClickHouse SETTINGS documentation](https://clickhouse.com/docs/en/operations/settings/settings) for available options

:::tip
If you don't see a connection you need, ask a connection owner or Global Admin to grant you `connection_use` permission, or [create a new ClickHouse connection](/ui/connection/clickhouse).
:::

### Step 2: Columns

Add and configure columns for your source.

**Recommended approach:**

Click **"Autoload columns"** to automatically load column definitions from the ClickHouse schema. This ensures column types are correct and saves manual configuration.

**Manual configuration:**

Click **"Add Column"** to add columns one by one if autoloading is not available or you want custom configuration.

**Column properties:**

Each column has several properties:

- **Name** – Column name in the database table
- **Display name** – Column name shown in the data explorer
- **Type** – Column type based on ClickHouse data type (used to determine eligible time columns)
- **Treat as JSON string** – Whether to parse this column as JSON in results
- **Autocomplete** – Enable autocompletion for this column in query input
- **Suggest** – Suggest this column in query input
- **Values** – Comma-separated list of predefined values (for `enum` type only)

### Step 3: Settings

Configure which columns have special roles:

- **Time column** – Used for filtering logs by time range (required)
  - Should match your ClickHouse table's partition key for optimal performance
  - Eligible column types: `datetime`, `timestamp`, `UInt64`, `Int64`
- **Date column** – Additional date column if your schema separates date and time (optional)
- **Severity column** – Used for colored log bars and default graph grouping (optional)
  - Configure this if your logs have a dedicated severity/level column
- **Default chosen columns** – Columns shown by default in the results table (required)
- **Execute query on open** – Controls whether queries run automatically when opening the explorer, or if the user must press "Execute" button explicitly

### Step 4: Naming

Specify source identification:

- **Slug** – Unique identifier (cannot be changed after creation)
  - Used as human-readable source identifier in URLs
  - Must be a valid [Django slug](https://docs.djangoproject.com/en/5.1/ref/forms/fields/#slugfield)
- **Name** – Human-readable source name (e.g., "Production App Logs", "Staging API Logs")
- **Description** – Optional description explaining what data this source provides

### Step 5: Review & Create

Review your configuration and click **"Create"** to save the source.

## Best practices

1. **Autoload columns** when possible to ensure accuracy
2. **Use time column** that matches your ClickHouse partition key for optimal query performance
3. **Only expose columns** needed for log analysis to keep the interface clean
4. **Configure severity column** if your logs have severity/level information
5. **Use descriptive names** indicating data type and environment (e.g., "Production App Logs")

## Related documentation

- [Source concepts](/concepts/source) – Understanding sources and their role
- [ClickHouse source details](/concepts/source#clickhouse-source) – Technical details
- [Connection configuration](/ui/connection) – Setting up connections
