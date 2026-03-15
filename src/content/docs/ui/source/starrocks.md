---
title: Creating a StarRocks source
description: Step-by-step guide for creating and configuring StarRocks sources
---

*Since v0.0.26*

Learn how to create a StarRocks source to query logs from StarRocks tables.

## Prerequisites

You need an existing StarRocks connection with `connection_use` permission. See [Creating a StarRocks connection](/ui/connection/starrocks) for setup instructions.

### Step 0: Open form

Navigate to **Sources** → **+Create**.

### Step 1: Connection

Choose an existing StarRocks connection from the dropdown and configure:

- **Catalog** – Catalog name in StarRocks (defaults to `default_catalog`)
  - StarRocks uses catalogs as a logical namespace above databases
  - Use `default_catalog` for internal (native) tables
  - Specify an external catalog name to access data in external systems (e.g., Hive, Iceberg, Hudi) via StarRocks [external catalog](https://docs.starrocks.io/docs/data_source/catalog/catalog_overview/) feature
- **Database** – Database name in StarRocks
- **Table** – Table name containing your logs
- **Query hints** – Optional query hints appended to queries via `SET_VAR()` syntax
  - Comma-separated key=value pairs (e.g., `query_timeout=300, pipeline_dop=4`)
  - Applied to all queries executed on this source
  - Useful for performance tuning or enforcing query limits
  - See [StarRocks system variables](https://docs.starrocks.io/docs/reference/System_variable/) for available options

:::tip
If you don't see a connection you need, ask a connection owner or Global Admin to grant you `connection_use` permission, or [create a new StarRocks connection](/ui/connection/starrocks).
:::

### Step 2: Columns

Add and configure columns for your source.

**Recommended approach:**

Click **"Autoload columns"** to automatically load column definitions from the StarRocks schema. This ensures column types are correct and saves manual configuration.

**Manual configuration:**

Click **"Add Column"** to add columns one by one if autoloading is not available or you want custom configuration.

**Column properties:**

Each column has several properties:

- **Name** – Column name in the database table
- **Display name** – Column name shown in the data explorer
- **Type** – Column type based on StarRocks data type (used to determine eligible time columns)
- **Treat as JSON string** – Whether to parse this column as JSON in results
- **Autocomplete** – Enable autocompletion for this column in query input
- **Suggest** – Suggest this column in query input
- **Values** – Comma-separated list of predefined values (for `enum` type only)

### Step 3: Settings

Configure which columns have special roles:

- **Time column** – Used for filtering logs by time range (required)
  - Should match your StarRocks table's partition key for optimal performance
  - Eligible column types: `datetime`, `timestamp`, `UInt64`, `Int64`
- **Date column** – Additional date column if your schema separates date and time (optional)
- **Default chosen columns** – Columns shown by default in the results table (required)
- **Execute query on open** – Controls whether queries run automatically when opening the explorer, or if the user must press "Execute" button explicitly

:::note[Severity column]
Severity column configuration is not currently supported for StarRocks sources. If your logs have a severity field, you can still include it as a regular column.
:::

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
2. **Use time column** that matches your StarRocks partition key for optimal query performance
3. **Only expose columns** needed for log analysis to keep the interface clean
4. **Use descriptive names** indicating data type and environment (e.g., "Production App Logs")
5. **Use external catalogs** to query logs stored in external systems without data duplication

## Related documentation

- [Source concepts](/concepts/source) – Understanding sources and their role
- [StarRocks source details](/concepts/source#starrocks-source) – Technical details
- [Connection configuration](/ui/connection) – Setting up connections
