---
title: Creating a Docker source
description: Step-by-step guide for creating and configuring Docker sources
---

Learn how to create a Docker source to stream logs from containers.

## Prerequisites

You need an existing Docker connection with `connection_use` permission. See [Creating a Docker connection](/ui/connection/docker) for setup instructions.

### Step 0: Open form

Navigate to **Sources** → **+Create**.

### Step 1: Connection

Choose an existing Docker connection from the dropdown.

:::tip
If you don't see a connection you need, ask a connection owner or Global Admin to grant you `connection_use` permission, or [create a new Docker connection](/ui/connection/docker).
:::

### Step 2: Columns

Review the predefined column list:

- Docker sources have a fixed, predefined list of available columns
- The column list cannot be modified (no adding or removing columns)

### Step 3: Settings

Configure source settings:

- **Default chosen columns** – Select which columns are displayed by default in the explorer (time column is always included)
- **Severity rules** – Configure rules to extract and normalize severity from log messages
  - See [Severity rules concept](/concepts/severity-rules) for understanding how they work
  - See [Severity rules by example](/howto/severity-rules) for configuration examples
- **Execute query on open** – Controls whether queries run automatically when opening the explorer, or if the user must press "Execute" button explicitly

### Step 4: Naming

Specify source identification:

- **Slug** – Unique identifier (cannot be changed after creation)
- **Name** – Human-readable source name (e.g., "Production Docker Logs")
- **Description** – Optional description of what logs this source provides

### Step 5: Review & Create

Review your configuration and click **"Create"** to save the source.

## Best practices

1. **Configure severity rules** to enable colored log bars and severity-based grouping
2. **Use descriptive names** indicating environment and purpose
3. **Select minimal default columns** to keep the interface clean

## Related documentation

- [Docker source details](/concepts/source#docker-source) – Technical details
- [Severity rules](/concepts/severity-rules) – Understanding severity extraction
- [Connection configuration](/ui/connection) – Setting up Docker connections
