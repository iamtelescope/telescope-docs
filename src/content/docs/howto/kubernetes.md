---
title: How to read Kubernetes pod logs in Telescope?
description: Learn how to query and analyze logs from Kubernetes pods and containers
---

This guide explains how to query and analyze logs from Kubernetes pods and containers in Telescope.

## Setup

Before querying logs, you need to:

1. [Create a Kubernetes connection](/ui/connection/kubernetes)
2. [Create a Kubernetes source](/ui/source/kubernetes)

## Querying Kubernetes logs

### How it works

Navigate to **Logs** → **Your Source** to open the [explorer](/ui/explorer) for the desired logs.

Since the Kubernetes API only supports querying logs for specific pods, Telescope needs to get a list of pods before fetching logs. Here's how it works:

1. **Load contexts and namespaces**: Telescope first loads the context list from your connection and namespace list from your source configuration. Before you can fetch logs, Telescope will load all contexts and their corresponding namespaces.

2. **Execute query**: Once contexts and namespaces are loaded, you can press the **Execute** button to fetch logs. By default, Telescope will fetch logs from all pods in all namespaces across all contexts that pass your filters. This might return more data than you need.

### Filtering queries

To make more specific queries, you have several filtering options:

#### Context and namespace selection

Use the dropdowns at the top to explicitly specify which contexts and namespaces to query:
- **Contexts** – Select one or more contexts from your kubeconfig
- **Namespaces** – Select one or more namespaces to query

For each selected context, Telescope will fetch logs from the selected namespaces within that context.

#### Pod filtering

Telescope supports three types of pod filters to further reduce the query scope:

1. **Pod Label Selector** – Filter pods by labels using [Kubernetes label selector syntax](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#label-selectors) (e.g., `app=frontend`, `tier=web`)

2. **Pod Field Selector** – Filter pods by fields using [Kubernetes field selector syntax](https://kubernetes.io/docs/concepts/overview/working-with-objects/field-selectors/) (e.g., `status.phase=Running`)

3. **Pod FlyQL Filter** – Use FlyQL expressions for complex pod filtering (e.g., `metadata.name ~ "api" and not metadata.name ~ "worker"`)
   - Hidden by default - enable with the "Pod FlyQL selector" toggle

:::note[Pod filtering differences]
**Pod Label Selector** and **Pod Field Selector** use **Kubernetes API syntax** ([label selectors](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#label-selectors), [field selectors](https://kubernetes.io/docs/concepts/overview/working-with-objects/field-selectors/)) and are sent directly to the Kubernetes API for server-side filtering. **Pod FlyQL Filter** is applied on top of the retrieved [pod object](https://kubernetes.io/docs/reference/kubernetes-api/workload-resources/pod-v1/) list and can use the full pod spec for more precise filtering.
:::

#### Preview pods

Click the **View Pods** button to preview which pods match your filters before fetching logs. This helps validate your filters and see exactly which pods will be queried.

#### Saved views

You can save all these parameters (contexts, namespaces, pod filters) as saved views and reuse them later without reconfiguring each time.

### Executing the query

After setting up all filters, press **Execute** to fetch logs. For Kubernetes sources, Telescope:
1. Uses a single query to fetch both graph data and log data
2. Fetches all logs in the desired time range
3. Sorts the logs
4. Strips the list by the configured limit
5. Returns the results to the frontend

:::caution
Kubernetes sources can potentially return large amounts of log data. Use time ranges and pod filters carefully to avoid overwhelming the system.
:::

## Available columns

See the [list of available columns](/ui/source/kubernetes#step-2-columns) in the Kubernetes source configuration guide.

## Performance considerations

### Concurrent requests

The **Max Concurrent Requests** setting controls parallelism per-context when fetching logs from multiple pods. Higher values provide faster results but increase cluster API load.

Adjust this value based on:
- Cluster size and number of pods typically queried
- Kubernetes API server capacity
- Network latency between Telescope and cluster

### Caching

Telescope caches context, namespace, and pod lists server-side to improve performance and reduce load on the Kubernetes API:

- **Cache duration**: 30 seconds
- **Context list** – Cached based on connection configuration and context filter
- **Namespace list** – Cached based on namespace filters (label, field, FlyQL selectors)
- **Pod list** – Cached based on all filters (namespace filters + pod filters)

Each cache is tied to your specific filter configuration. Changing any filter will trigger a fresh fetch from the Kubernetes API. If you don't see recently created pods or namespaces, the data may be cached and will automatically refresh after 30 seconds.

## Best practices

1. **Efficient filtering**:
   - Use label selectors for application-specific filtering
   - Use field selectors for pod state filtering (e.g., Running pods only)
   - Use FlyQL for complex cross-field logic
2. **Preview before querying**: Use **View Pods** button to verify your filters match expected pods
3. **Time ranges**: Keep time ranges reasonable (e.g., last 30 minutes, last hour)
   - Large time ranges can overload the Kubernetes API and Telescope backend
   - For historical log analysis, consider scraping logs to a ClickHouse database instead
4. **Connection reuse**: Share one Kubernetes connection across multiple sources
5. **Concurrency tuning**: Adjust **Max Concurrent Requests** based on cluster size and query patterns

## Related documentation

- [Kubernetes connection](/concepts/connection#kubernetes-connection)
- [Kubernetes source](/concepts/source#kubernetes-source)
- [Querying](/concepts/querying)
