---
title: Source Configuration
description: Learn how to create and configure sources for ClickHouse and Docker data connections in Telescope.
---

To create a source, you need to fill in the form data.

## Connection Data
### ClickHouse Source
- **`host`** – ClickHouse server host. Defaults to `localhost`.
- **`port`** – ClickHouse server native protocol port. Defaults to `9000`.
- **`user`** – Username used to connect to the server. Defaults to `default`.
- **`password`** – Password used to connect to the server.
- **`database`** – Database name.
- **`table`** – Table name.
- **`ssl`** – Whether to use a secure connection. (Custom SSL certificates are not yet supported.)

If SSL is enabled, a few additional options become available:
- **`Verify`** – specifies whether a certificate is required and whether it will be validated after connection. Defaults to True.
- **`CA Certs`** – see [**ssl.wrap_socket()**](https://docs.python.org/2/library/ssl.html#ssl.wrap_socket) docs
- **`Cert file`** – see [**ssl.wrap_socket()**](https://docs.python.org/2/library/ssl.html#ssl.wrap_socket) docs
- **`Key file`** – see [**ssl.wrap_socket()**](https://docs.python.org/2/library/ssl.html#ssl.wrap_socket) docs
- **`SSL file`** – see [**ssl.wrap_socket()**](https://docs.python.org/2/library/ssl.html#ssl.wrap_socket) docs
- **`Ciphers`** – see [**ssl.wrap_socket()**](https://docs.python.org/2/library/ssl.html#ssl.wrap_socket) docs
- **`Server hostname`** – Hostname to use in SSL Wrapper construction. Defaults to None which will send the passed host param during SSL initialization. This param may be used when connecting over an SSH tunnel to correctly identify the desired server via SNI.
- **`Alt hosts`** – list of alternative hosts for connection.

### Docker Source
- **`address`** – The URL of the Docker daemon socket. This is typically something like `unix:///var/run/docker.sock` for local access, or `tcp://<host>:<port>` for remote connections.

After filling in the connection data, you need to test the connection by clicking the **"Validate connection & load schema"** button.

If the connection test is successful, you will later have the option to automatically populate the form fields using the **"Load fields from schema"** button.

If the connection test fails, you can still create the source, but you will need to add the fields manually.

## Common Data
- **`slug`** – A unique [slug](https://docs.djangoproject.com/en/5.1/ref/forms/fields/#slugfield) field. Cannot be changed after creation (used as a human-readable source identifier).
- **`name`** – Source name.
- **`description`** – Source description.


## Fields Setup

In this section, you need to define the list of fields and configure their usage.
If the connection test was previously successful, you can automatically add fields from the retrieved schema using the **"Load fields from schema"** button.

After adding fields, the **"Time field"** and **"Severity field"** options will become selectable from a dropdown list.

- **`Time field`** – Used in the time range selector for querying data.
- **`Severity field`** – Used to apply different colors to message bars based on severity and as a default field for graph grouping. If not set, no colored bars appear in the result table, and no group-by field is selected by default.
  :::note
  This setting is **disabled for Docker sources**, which do not support severity highlighting.
  :::
- **`Default chosen fields`** – Comma-separated list of values for the field selector. Each value must exist in the field name list.


:::note
For **Docker sources**, the field list is **predefined and cannot be customized**. You may remove individual fields, but new fields cannot be added.
:::

### **Field Properties**
Each field has several properties:

- **`Name`** – This name is mapped to the field name in the database table.
- **`Display Name`** – This name is used in the table as alias when querying logs.
**`Type`** – The field type, based on the ClickHouse data type. If the schema is loaded automatically, this type is derived directly from ClickHouse. When adding fields manually, users can select a type from a predefined list or enter it manually. Currently, the type is primarily used to determine which fields can be selected as the **`Time field`** (only fields containing `datetime` are eligible).
- **`Treat as JSON String`** – A boolean property that defines whether this field should be treated as a JSON object in the result. If set to `true`, the server will convert the string into a JSON object. If set to `false`, the value will remain a string and will be displayed as such in the UI.
- **`Autocomplete`** – A boolean property that defines whether this field should use autocompletion in the query input.
- **`Suggest`** – A boolean property that defines whether this field should be suggested in the query input.
- **`Values`** – A comma-separated list of predefined field values. This field is used only for the `enum` type. It allows specifying a fixed set of values for a particular field, ensuring that only valid options are used. This is particularly useful for `enum` types, as it helps prevent sending requests with incorrect data.