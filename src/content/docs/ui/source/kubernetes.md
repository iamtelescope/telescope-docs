---
title: Creating a Kubernetes source
description: Step-by-step guide for creating and configuring Kubernetes sources
---

Learn how to create a Kubernetes source to query logs from pods and containers via the Kubernetes API.

## Prerequisites

You need an existing Kubernetes connection with `connection_use` permission. See [Creating a Kubernetes connection](/ui/connection/kubernetes) for connection setup instructions.

### Step 0: Open form

Navigate to **Sources** → **+Create**.

### Step 1: Connection

Choose an existing Kubernetes connection from the dropdown and configure namespace filtering:

:::tip
If you don't see a connection you need, ask a connection owner or Global Admin to grant you `connection_use` permission, or [create a new Kubernetes connection](/ui/connection/kubernetes).
:::

**Namespace filtering (optional):**

Configure which namespaces are available:

- **Namespace label selector** – Filter namespaces by labels using [Kubernetes label selector syntax](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#label-selectors) (e.g., `env=production`)
- **Namespace field selector** – Filter namespaces by fields using [Kubernetes field selector syntax](https://kubernetes.io/docs/concepts/overview/working-with-objects/field-selectors/) (e.g., `metadata.name=default`)
- **Namespace FlyQL filter** – Use FlyQL expressions for complex namespace filtering

:::note[Namespace filtering differences]
- **Namespace label selector** and **Namespace field selector** use **Kubernetes API syntax** ([label selectors](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#label-selectors), [field selectors](https://kubernetes.io/docs/concepts/overview/working-with-objects/field-selectors/)) and are sent directly to the Kubernetes API for server-side filtering.
- **Namespace FlyQL filter** is applied after retrieving data from Kubernetes API on the full [namespace object](https://kubernetes.io/docs/reference/kubernetes-api/cluster-resources/namespace-v1/) (client-side filtering).
:::

### Step 2: Columns

Review the predefined column list:

- Kubernetes sources have a fixed, predefined list of available columns
- The column list cannot be modified (no adding or removing columns)

**Available columns:**

| Column | Type | Description |
|--------|------|-------------|
| `time` | datetime | Timestamp of the log entry |
| `severity` | string | Extracted severity level (configured via severity rules) |
| `context` | string | Kubernetes context name |
| `namespace` | string | Kubernetes namespace |
| `pod` | string | Name of the pod |
| `container` | string | Name of the container |
| `node` | string | Name of the node hosting the pod |
| `labels` | json | Pod labels as JSON object |
| `annotations` | json | Pod annotations as JSON object |
| `body` | json | Log message content (normalized from container output) |
| `status` | string | Pod status (Running, Pending, etc.) |

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
- **Name** – Human-readable source name (e.g., "Production K8s Logs")
- **Description** – Optional description of what logs this source provides

### Step 5: Review & Create

Review your configuration and click **"Create"** to save the source.

## Best practices

1. **Use namespace filters** to limit scope and improve performance
2. **Configure severity rules** to enable colored log bars and severity-based grouping
3. **Use descriptive names** indicating environment and purpose
4. **Select minimal default columns** to keep the interface clean (you can always add more when querying)

## Related documentation

- [Kubernetes setup guide](/howto/kubernetes) – Complete guide for Kubernetes log setup
- [Kubernetes source details](/concepts/source#kubernetes-source) – Technical details
- [Severity rules](/concepts/severity-rules) – Understanding severity extraction
- [Pod filtering](/ howto/kubernetes#pod-filtering) – Advanced filtering options during querying
