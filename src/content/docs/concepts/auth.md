---
title: Authentication & Authorization
description: Learn about authentication methods and RBAC permission model in Telescope
---

## Authentication

Telescope utilizes [Django's](https://www.djangoproject.com/) default authentication system.
For GitHub authentication, it uses the [django-allauth](https://docs.allauth.org/en/latest/) package.

The basic authentication flow is as follows:

* The user provides credentials (username and password) or logs in via a social account (e.g., GitHub).
* The backend verifies the credentials and stores the session object in the database.
* For each request, the session is validated and verified.

## Authorization

Most actions in Telescope are protected via RBAC (Role-Based Access Control).

RBAC is an access control model that restricts system access based on user roles. It ensures that users have only the permissions necessary to perform their tasks.

A user or group is assigned one or more roles.
Each role contains a set of permissions.
When a user attempts an action, the system checks if their assigned role includes the required permission.
If the permission is granted, the action proceeds; otherwise, access is denied.

There are three kinds of roles in Telescope: **Global Roles**, **Connection Roles**, and **Source Roles**.
Roles and permissions are currently hardcoded in the code, and users cannot create their own roles.

## Global Roles

Global roles apply to the entire system.
There is only one global role: **Admin**.

### **Admin**
This role grants full access to the system.
It includes the following global permissions:

**Source Permissions:**
- `global_create_source`
- `global_read_source`
- `global_edit_source`
- `global_grant_source`
- `global_raw_query_source`
- `global_use_source`
- `global_delete_source`

**Connection Permissions:**
- `global_create_connection`
- `global_read_connection`
- `global_edit_connection`
- `global_grant_connection`
- `global_use_connection`
- `global_delete_connection`

**RBAC Management:**
- `global_manage_rbac` – Manage users, groups, and role bindings

## Connection Roles

Connection roles control access to individual [Connections](/concepts/connection).
Available roles and their permissions:

### **Owner**
Has full control over the connection.
Permissions:
- `connection_read` – View connection details
- `connection_edit` – Modify connection parameters
- `connection_delete` – Delete the connection (if not in use)
- `connection_use` – Use connection when creating sources
- `connection_grant` – Manage connection access for others

### **Editor**
Can read, edit, and delete the connection.
Permissions:
- `connection_read`
- `connection_edit`
- `connection_delete`

### **Viewer**
Can only view connection details.
Permissions:
- `connection_read`

### **User**
Can view and use the connection in sources.
Permissions:
- `connection_read`
- `connection_use`

:::note
The `connection_use` permission is required to create sources that reference the connection.
:::

## Source Roles

Source roles are tied to a specific data [Source](/concepts/source).
Available roles and their permissions:

### **Owner**
Has full control over the source.
Permissions:
- `source_read` – View source configuration
- `source_edit` – Modify source settings
- `source_delete` – Delete the source
- `source_use` – Query logs from the source
- `source_grant` – Manage source access for others
- `source_raw_query` – Execute raw SQL queries

### **Editor**
Can read, edit, and delete the source.
Permissions:
- `source_read`
- `source_edit`
- `source_delete`

### **Viewer**
Can only read the source configuration.
Permissions:
- `source_read`

### **User**
Can read and query logs from the source.
Permissions:
- `source_read`
- `source_use`

### **Raw Query User**
Can read, use, and execute raw queries on the source.
Permissions:
- `source_read`
- `source_use`
- `source_raw_query`

:::warning
**Raw Query** permission allows executing arbitrary SQL queries against the underlying database. Grant this permission carefully.
:::

## Permission Hierarchy

Permissions follow this hierarchy:

```
Global Admin
    ↓
 [Has all permissions system-wide]
    ↓
Connection Owner          Source Owner
    ↓                         ↓
Connection Editor         Source Editor
    ↓                         ↓
Connection User           Source User
    ↓                         ↓
Connection Viewer         Source Viewer
```

## Permission Combinations

To perform common tasks, users need specific permission combinations:

| Task | Required Permissions |
|------|---------------------|
| View connection list | `connection_read` (on connection) OR global read permission |
| Create a source | `global_create_source` AND `connection_use` (on target connection) |
| Query logs | `source_read` AND `source_use` (on source) |
| Edit source config | `source_edit` (on source) |
| Share source access | `source_grant` (on source) |
| Delete connection | `connection_delete` (connection must not be in use) |

## Best Practices

1. **Principle of Least Privilege**: Grant users the minimum permissions needed
2. **Use Groups**: Assign roles to groups rather than individual users when possible
3. **Separate Concerns**:
   - Connection permissions control infrastructure access
   - Source permissions control data access
4. **Audit Regularly**: Review role bindings periodically
5. **Raw Query Caution**: Only grant raw query permission to trusted users

## Related Concepts

- [Connection](/concepts/connection) – Connection permission model
- [Source](/concepts/source) – Source permission model
