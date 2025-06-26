---
title: Query Input
description: Learn the FlyQL query syntax for filtering data in ClickHouse and Docker sources.
---

Query input syntax is [FlyQL](https://github.com/iamtelescope/flyql) syntax. Please refer FlyQL doc.

- For ClickHouse sources queries generates by [FlyQL ClickHouse generator](https://github.com/iamtelescope/flyql-generators/tree/main/python/flyql_generators)
- For **Docker** sources, queries are evaluated directly in Python using [FlyQL's matcher](https://github.com/iamtelescope/flyql/blob/main/python/flyql/matcher/evaluator.py), which does **not support `LIKE`-style wildcard matching**.

:::caution
In Docker sources, expressions like `host=l*ohost` are **not** interpreted using SQL-style `LIKE`. Instead, you should use `=~` for pattern matching, e.g. `host=~"^l.*ohost$"`.
:::

Despite the fact that the documentation for flyql and flyql ClickHouse generator is located in their respective repositories, a few query examples are provided here to give a basic understanding of how to query data inside Telescope.

`host=localhost` - Selects records where the `host` field is exactly `"localhost"`.

`host!=localhost` - Selects records where the `host` field is **not** `"localhost"`.

`host=l*ohost` - Selects records where the `host` field starts with `"l"`, ends with `"ohost"`, and has any characters in between.
- **ClickHouse**: Matches records where `host` starts with `"l"` and ends with `"ohost"` using SQL `LIKE`.
- **Docker**: **Not supported** — use a regular expression instead: `host=~'^l.*ohost$'`.

`host=localhost and message=2025*` - Selects records where the `host` is `"localhost"` and the `message` field starts with `"2025"`.

`(host=localhost or host=remote) and not host=puppet` - Selects records where the `host` is either `"localhost"` or `"remote"`, but **not** `"puppet"`.

`rest:bytes>=25` - Selects records where the `bytes` field inside the `rest` JSON object is greater than or equal to `25`.

`rest:url=~".*monkey.*"` - Selects records where the `url` field inside the `rest` JSON object contains the word `"monkey"` anywhere in the string.

## New Features (v0.0.19)

### Whitespace Support
FlyQL now supports whitespace around operators for improved readability:

`host = localhost` - Equivalent to `host=localhost`, with spaces around the `=` operator.

`rest:bytes >= 25` - Equivalent to `rest:bytes>=25`, with spaces around the `>=` operator.

### Typed Keys
FlyQL now supports typed keys for more precise field targeting:

`jsonfield:user-agent = 'firefox'` - Selects records where the `user-agent` field in the `jsonfield` JSON object equals `'firefox'`.

### Quoted JSON Paths
For JSON paths containing special characters (like colons), you can now use quotes:

`jsonfield:'my:key:with:colon':path = 123` - Selects records where the JSON path `jsonfield` → `my:key:with:colon` → `path` equals `123`.

This is particularly useful when your JSON field names contain colons or other special characters that would otherwise be interpreted as path separators.