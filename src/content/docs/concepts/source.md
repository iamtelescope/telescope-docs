---
title: Source
description: TODO
---


A Source is an object that defines connection parameters for an external data source, such as a database, API, or file. It also specifies which fields from the given source should be used and how.

Additionally, a source acts as an RBAC entity, allowing roles to be assigned to users and groups.

Currently, ClickHouse and Docker sources are supported. 

For ClickHouse connections, Telescope uses the [clickhouse-connect](https://clickhouse.com/docs/en/integrations/language-clients/python/intro) Python library, which communicates exclusively over HTTP(S) protocol. As of version 0.0.19, the native protocol (previously supported via clickhouse-driver) is no longer supported.
