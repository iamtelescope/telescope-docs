---
title: Creating a Kubernetes connection
description: Step-by-step guide for creating and configuring Kubernetes connections
---

Learn how to create a Kubernetes connection for accessing Kubernetes cluster logs.

## Prerequisites

- Access to a Kubernetes cluster
- `global_create_connection` permission (Global Admin role)

### Step 0: Open form

Navigate to **Connections** → **New**.

### Step 1: Target

Select **Kubernetes** as the connection kind and provide your kubeconfig:
   - **Option 1**: Paste the kubeconfig file content (as YAML) directly in the configuration field
   - **Option 2**: Enable "Use local file path instead of content" and provide the path to your kubeconfig file (e.g., `~/.kube/config`)

**Optional settings:**

- **Context FlyQL filter** – Filter which contexts from your kubeconfig should be available
  - Use FlyQL expressions to filter contexts by name (e.g., `name ~ "prod.*"` to include only production contexts)
  - Leave empty to include all contexts from the kubeconfig

:::note[When to use Context FlyQL filter]
This filter is most useful when using a file path for kubeconfig, as the file might be updated in the future and you want to filter only desired contexts. For YAML-based config, it makes less sense since you can control which contexts are included in the YAML directly.
:::

- **Max concurrent requests** – Control parallelism when fetching logs from multiple pods (default: 20)
  - This limit applies per-context
  - Higher values provide faster results but increase cluster API load

:::tip[Test before saving]
Click **"Test connection"** to verify access and see the list of available contexts.
:::

### Step 2: Naming

- **Name** – Connection name (e.g., "Production K8s", "Staging Kubernetes")
- **Description** – Optional description explaining which clusters this connection accesses

### Step 3: Review & Create

Review your configuration and click **"Create"** to save the connection.

## Best practices

1. **Filter contexts** with FlyQL when file contains multiple environments
2. **Tune concurrency** based on cluster size and API capacity
3. **Use descriptive names** indicating which cluster/environment

## Security recommendations

- Use separate connections for different environments (prod/staging/dev)
- Ensure kubeconfig has minimal required permissions (read-only access to pods/logs)

## Troubleshooting

**Connection test fails:**
- Verify kubeconfig is valid YAML
- Ensure contexts have necessary credentials
- Check cluster API is accessible from Telescope
- Verify RBAC permissions allow listing pods and reading logs

**No contexts available:**
- Check Context FlyQL filter isn't too restrictive
- Verify kubeconfig contains valid contexts
- Ensure contexts have active clusters configured

## Related documentation

- [Kubernetes connection concept](/concepts/connection#kubernetes-connection) – Technical details
- [Creating a Kubernetes source](/ui/source/kubernetes) – Next step after connection
- [Kubernetes setup guide](/howto/kubernetes) – Complete setup walkthrough
- [Connection permissions](/ui/connection#connection-permissions) – Managing access
