---
title: Query Input
description: Filter Telescope data with FlyQL queries — operators, JSON paths, and per-source dialect behavior.
---

The Query Input uses [FlyQL](https://docs.flyql.dev/) syntax. The canonical reference (operators, value forms, lists, dates, pattern matching, transformers, renderers) lives at [docs.flyql.dev](https://docs.flyql.dev/syntax/) — this page only covers what is **specific to Telescope**.

## How Telescope evaluates queries

Each source kind compiles or evaluates the same FlyQL query differently:

| Source kind | Evaluation path |
|---|---|
| ClickHouse | Compiled to a SQL `WHERE` clause via the [FlyQL ClickHouse generator](https://docs.flyql.dev/sql/clickhouse/). |
| StarRocks | Compiled to a SQL `WHERE` clause via the [FlyQL StarRocks generator](https://docs.flyql.dev/sql/starrocks/). |
| Docker | Logs are pulled from the daemon and matched in-process by the [FlyQL Python matcher](https://docs.flyql.dev/syntax/). |
| Kubernetes | Logs are pulled from the Kubernetes API and matched in-process by the same matcher. |

For SQL-backed sources, supported operators ultimately depend on what the dialect can express. For Docker/Kubernetes, all evaluation happens in Python and behaves as documented in the FlyQL syntax reference.

## `like` and pattern matching

`like` and the regex operators (`~`, `!~`) are supported across all sources, but the semantics differ slightly:

- **ClickHouse / StarRocks:** `like` compiles to native SQL `LIKE` (`%`, `_` wildcards). Regex compiles to `match()` / equivalent.
- **Docker / Kubernetes:** evaluated by [google-re2](https://github.com/google/re2) on the server. Use regex for wildcard matching: `pod ~ "^api-.*"` instead of `pod like "api-*"`.

## Editor features

The query editor (powered by [`flyql-vue`](https://docs.flyql.dev/editor/)) provides:

- **Inline diagnostics**: parse errors and unknown columns are flagged with red squiggles and explained in a panel under the editor.
- **Context-aware suggestions**: column names, operators, values, transformers, and boolean operators are suggested based on cursor position. `Tab` cycles between value and column suggestions when typing a value.
- **Value autocomplete**: for columns with `autocomplete: true` in the source schema, value suggestions are fetched from the underlying datastore (ClickHouse `DISTINCT` / StarRocks `GROUP BY`).
- **JSON key discovery**: typing `column.` on a JSON-typed column triggers a server lookup that suggests nested keys actually present in your recent data, including for ClickHouse `JSON`/`JSONString` columns and Kubernetes `labels`/`annotations`.
- **Submit**: `Ctrl+Enter` (or `Cmd+Enter`) executes the query.

## Examples

```
host = localhost
host != localhost and message ~ "^2025-"
(host = localhost or host = remote) and not host = puppet
status in [200, 201, 204]
labels.'app.kubernetes.io/component' = "controller"
active and not archived
```

For deeper coverage — operators (`has`, `in`, truthy checks, ranges), date literals, parameters, reserved words, and the transformer/renderer pipeline — see the [FlyQL syntax docs](https://docs.flyql.dev/syntax/).
