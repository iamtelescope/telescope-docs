---
title: Changelog
description: TODO
---


## 2025.06.26
Version: **0.0.19**

Changes:
- Telescope has migrated to [`clickhouse-connect`](https://github.com/ClickHouse/clickhouse-connect) and now communicates with ClickHouse server exclusively over the HTTP(S) interface.
- Support for the native protocol (`clickhouse-driver`) has been removed.
- `JSON` ClickHouse data type is now supported
- FlyQL now supports **whitespace around operators**. Expressions like `key = value` are valid now (previously only `key=value` was allowed).
- FlyQL now supports **typed keys**, such as `jsonfield:user-agent = 'firefox'`.
- FlyQL now supports **quoted JSON paths** to handle special characters like colons. Example: `jsonfield:'my:key:with:colon':path = 123`.

Notes:

:::caution

After this update, **all ClickHouse sources must use HTTP(S) ports**.  
Telescope no longer supports the native ClickHouse protocol.  
**All existing sources must be manually reconfigured** to use an HTTP(S) endpoint (typically port `8123` for HTTP and `8443` for HTTPS).  
Failure to do so will result in connection errors.

:::

**Motivation for dropping native protocol support**

- `clickhouse-connect` is the officially supported driver by ClickHouse Inc., ensuring long-term support and faster access to new ClickHouse features.
- In Telescope's workload profile — primarily log browsing and filtering — the performance difference for `SELECT` queries is negligible, as result sets are typically small (≤10,000 rows).
- Simplifies deployment by eliminating native dependencies and improves compatibility with managed environments and cloud infrastructure.

## 2025.05.18
Version: **0.0.18**
Changes:
  - Implemented saved views
  - Small bugfixes & improvements

Related issues:
 - [ISSUE-3](https://github.com/iamtelescope/telescope/issues/3)

Notes:

:::caution

This release requires database migrations to be run.

:::

## 2025.04.20
Version: **0.0.17**
Changes:
  - Implemented token-based authentication (API tokens) as a foundation for future API access
  - Bugfixed data section border misalignment in the Explorer. Thanks to [meirdev](https://github.com/meirdev)!

Related issues:
 - [ISSUE-24](https://github.com/iamtelescope/telescope/issues/24)

Notes:

:::caution

This release requires database migrations to be run.

:::

## 2025.04.08
Version: **0.0.16**
Changes:
  - Added various options for SSL-based ClickHouse connections
  - Added the ability to disable authentication via the config file

Notes:

:::caution

This release requires database migrations to be run.

:::

## 2025.04.01
Version: **0.0.15**
Changes:
  - Added Docker as a new source kind
  - Redesigned source list
  - Added toggle to show/hide filters on the explorer page
  - Fixed bug in date range selector when using the graph
  - Fixed bug where the show/hide graph option wasn’t preserved on reload

Notes:

:::caution

This release requires database migrations to be run.

:::

## 2025.03.19
Version: **0.0.14**

Changes:
 - The source time field now supports UInt64, Int64, and timestamp ClickHouse types. Thanks to [Zerg1996](https://github.com/Zerg1996)!

Related issues:
 - [ISSUE-13](https://github.com/iamtelescope/telescope/issues/13)

## 2025.03.15
Version: **0.0.13**

Changes:
 - Added config option to force github authentication on login page

## 2025.03.11
Version: **0.0.12**
Changes:
 - Explorer UI update: query settings and chart settings have been moved into separate dropdown menus to improve usability and reduce interface clutter.
 - Added a placeholder for the raw query editor and made various style adjustments

## 2025.03.10 +
Version: **0.0.11**
Changes:
 - Added support for raw SQL `WHERE` statements

Related issues:
 - [ISSUE-5](https://github.com/iamtelescope/telescope/issues/5)

## 2025.03.10
Version: **0.0.10**
Changes:
 - Added support for custom fields in the "Group By" option on graphs.
 - Changed data loading behavior: now, when making a new request, the old data remains on the screen until the new data is fully loaded.
 - Bugfix for a mismatch between time values in graphs and data tables (caused by differences between UTC and non-UTC timestamps).

Related issues:
 - [ISSUE-4](https://github.com/iamtelescope/telescope/issues/4)

Notes:

:::caution

This release requires database migrations to be run.

:::

## 2025.02.27
Version: **0.0.9**

Changes:
 - Make the source severity field optional.

Related issues:
 - [ISSUE-6](https://github.com/iamtelescope/telescope/issues/6)


## 2025.02.24
Version: **0.0.8**

Changes:
 - Bugfix for non-UTC time fields in ClickHouse
 - Bugfix for specifying time with histogram range selection

## 2025.02.19
Version: **0.0.7**

Changes:
- Cosmetic login screen update.

## 2025.02.18
Version: **0.0.6**

Changes:
- Fixed monaco editor static files.

## 2025.02.17
Version: **0.0.5**

Changes:
- Fixed a bug inside fields parser.
- Updated modifiers docs.
- Added naive support for Map & Array ClickHouse types.
- Added new modifiers:
    - [href](./ui/explorer/fields.md#href), for dynamically creating HTML links.
    - [format](./ui/explorer/fields.md#format), for pretty formatting of SQL or JSON data.
    - [highlight](./ui/explorer/fields.md#highlight), for syntax highlighting of SQL or JSON data.

## 2025.02.13
Version: **0.0.4**

Changes:
- Fixed default JSON renderer to handle unserializable objects properly.

## 2025.02.13
Version: **0.0.3**

Changes:
- Added placeholders for fields and query inputs based on source fields.

## 2025.02.12
Version: **0.0.2**

Changes:
 - Initial release
