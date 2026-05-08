---
title: Columns Input
description: Define which columns appear in the explorer table and how their values are formatted.
---

The Columns Input is a comma-separated list of [FlyQL column expressions](https://docs.flyql.dev/editor/columns-component/). Each entry must reference a column declared on the source — unknown columns surface as inline diagnostics in the editor.

A single entry may include:

1. A **column name** (or dotted path into a JSON / Map column).
2. Zero or more **transformers** chained with `|` — they reshape the value before display.
3. An optional **alias** with `as` — the header label in the table.
4. Zero or more **renderers** chained with `|` after the alias — they control how the value is rendered (escape vs. HTML).

```
message
message|chars(25) as msg
labels.'app.kubernetes.io/component' as comp
payload|json as p|highlight
url as link|href("https://example.com/${value}")
```

See the [FlyQL transformers reference](https://docs.flyql.dev/syntax/transformers/) and [renderers reference](https://docs.flyql.dev/syntax/renderers/) for the full pipeline grammar.

## Renderers require an alias

Renderers (`highlight`, `hl`, `href`) only attach **after** an `as alias` clause. Pipes before the alias are transformers, pipes after are renderers:

```
payload|json as p|highlight   ✓ json is a transformer, highlight is a renderer
payload|json|highlight        ✗ both treated as transformers, highlight is rejected
```

This is enforced by the editor — a chained renderer without an alias is flagged as a syntax error.

## Nested paths (JSON, Map, Array)

For columns whose source type is JSON, JSONString, or Map (Kubernetes `labels`/`annotations`/`body`, ClickHouse `JSON`/`JSONString`/`Map(...)`, etc.), use dot notation to extract nested keys:

```
rest.app.request.bytes
metadata.request_id
labels.'app.kubernetes.io/component'
```

Quote a segment with single quotes when it contains dots, slashes, or other special characters. The [FlyQL nested keys docs](https://docs.flyql.dev/syntax/nested-keys/) cover the grammar in detail.

The editor will suggest discovered nested keys for JSON-typed columns as you type — driven by a sample of recent rows from the underlying datastore.

## Transformers available in Telescope

Transformers are evaluated in the browser (display-side) by Telescope; not all are pushed down to SQL. The full list:

| Name | Purpose |
|---|---|
| `chars(from[, to])` | Substring by character index. |
| `slice(from[, to])` | Substring (alias for `chars` with the standard slice convention). |
| `lines(from[, to])` | Slice of lines from a multi-line value. |
| `firstline` | First line of a multi-line value. |
| `lastline` | Last line of a multi-line value. |
| `oneline` | Strip newlines, collapse to a single line. |
| `lower` | Lowercase. |
| `upper` | Uppercase. |
| `split(sep)` | Split a string into an array. |
| `join(sep)` | Join an array back into a string. |
| `json` | Parse a string as JSON. |
| `str` | Coerce a value to its JSON-string representation. |
| `type` | The value's runtime type (`string`, `number`, `array`, …). |
| `fmt([lang])` / `format([lang])` | Pretty-print as JSON or SQL (auto-detected if `lang` is omitted). |

`lower`, `upper`, and `split` are also pushed down to SQL on ClickHouse and StarRocks sources, so they can appear in [query filters](/ui/explorer/query) too. The remaining transformers are display-only — using them in a query filter raises an error.

## Renderers available in Telescope

Renderers control how the post-alias value is rendered into the result cell. Telescope ships three:

| Name | Purpose |
|---|---|
| `highlight([lang])` / `hl([lang])` | Apply syntax highlighting via [highlight.js](https://highlightjs.org/) — useful with `|fmt as x|highlight` for JSON/SQL bodies. |
| `href(template[, displayValue])` | Render the cell as an `<a>` tag. `template` may include `${value}`. |

Only one renderer may be chained per column. Renderers do not affect query evaluation — they're purely a display concern.

## Examples

```
# Show only the first 80 chars of the message
message|chars(80) as msg

# Pull a tab-separated JSON payload out of a log line and render highlighted
message|split("\t")|slice(-1)|join|fmt as payload|highlight

# Link an order ID to an external system
order_id as order|href("https://orders.internal/${value}")

# Extract a specific Kubernetes label
labels.'app.kubernetes.io/component' as comp
```
