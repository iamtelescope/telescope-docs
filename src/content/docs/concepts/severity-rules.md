---
title: Severity Rules
description: Understanding severity extraction and normalization for Docker and Kubernetes sources
---

*Since v0.0.24*

Severity rules enable [Docker](/concepts/source#docker-source) and [Kubernetes](/concepts/source#kubernetes-source) sources to extract and normalize severity information from log message bodies. Unlike [ClickHouse sources](/concepts/source#clickhouse-source) that have dedicated severity columns, Docker and Kubernetes logs typically embed severity within the message text itself (e.g., `{"level": "error"}` or `[ERROR] Connection failed`).

:::note[Source type limitation]
Severity rules are **only available for [Docker](/concepts/source#docker-source) and [Kubernetes](/concepts/source#kubernetes-source) sources**. [ClickHouse sources](/concepts/source#clickhouse-source) have dedicated severity columns and do not need extraction rules.
:::

## Why severity rules?

Without severity rules:
- Docker and Kubernetes logs appear without color coding
- Severity-based graph grouping is not available
- Log analysis lacks visual severity indicators

With severity rules:
- Colored log bars indicate severity at a glance
- Graph grouping by severity reveals patterns
- Consistent visualization across all source types

## How severity rules work

Severity rules operate in two phases: **extraction** and **remapping**.

### Phase 1: extraction

Extract severity from the raw message body using one of two methods:

#### JSON extraction

Navigate nested JSON structure using comma-separated paths.

**Example:**
- Path: `log,level`
- Log: `{"log": {"level": "warn"}, "timestamp": "2024-01-01"}`
- Extracted: `"warn"`

JSON extraction is useful for structured logging formats where severity is embedded in a JSON field.

#### Regex extraction

Match patterns with optional capture groups.

**Example:**
- Pattern: `\[(\w+)\]`
- Capture group: `1`
- Log: `[ERROR] Connection failed`
- Extracted: `"ERROR"`

Regex extraction is useful for plain text log formats where severity appears in the message text. Capture groups allow you to extract specific parts of the match:
- Group `0` = full match (e.g., `[ERROR]`)
- Group `1` = first capture group (e.g., `ERROR`)
- Group `2+` = additional capture groups if defined

**Case-insensitive matching:** Available as an option for regex rules.

#### Evaluation order

Rules are evaluated in the order defined. **The first rule that successfully extracts a value wins**, and remaining extraction rules are skipped.

This allows you to define multiple rules as fallbacks:
1. Try JSON extraction first
2. If that fails, try regex pattern matching
3. If all rules fail, severity defaults to `UNKNOWN`

### Phase 2: remapping (optional)

Map extracted values to normalized severity levels using regex pattern matching.

#### Pattern matching

Remap rules use regex patterns to match extracted values:

**Example:**
- Pattern: `warn.*`
- Extracted value: `"warning"`
- Normalized to: `"WARN"`

**Characteristics:**
- Patterns are evaluated as regex (e.g., `error|err|e` matches any of these)
- Patterns use fullmatch semantics (must match entire extracted value)
- Case-insensitive matching available per rule
- **First matching pattern wins** (evaluation order matters)

#### Normalized severity levels

Telescope recognizes eight standard severity levels for visualization:

| Level | Color | Typical Use |
|-------|-------|-------------|
| `UNKNOWN` | Gray | Default when extraction fails or no match |
| `FATAL` | Red | Fatal errors causing application shutdown |
| `ERROR` | Red | Error conditions requiring attention |
| `CRITICAL` | Orange | Critical conditions |
| `WARN` | Yellow | Warning messages |
| `INFO` | Blue | Informational messages |
| `DEBUG` | Green | Debug information for development |
| `TRACE` | Gray | Detailed trace information |

#### Fallback behavior

If no remap rule matches, the extracted value is used as-is. This allows custom severity levels while still benefiting from extraction and visualization.

## Configuration

Severity rules are configured during source creation or editing in the source wizard:

1. **Extraction rules**: Define one or more rules to extract severity from message bodies
   - Choose between JSON field extraction or regex pattern matching
   - Order rules from most specific to most general

2. **Remap rules**: Optionally normalize extracted values to standard levels
   - Use regex patterns for flexible matching
   - Order patterns from most specific to most general
   - Enable case-insensitive matching as needed

See the [Source Configuration UI](/ui/source#severity-rules-dockerkubernetes-only) for step-by-step UI instructions and the [Severity Rules How-to Guide](/howto/severity-rules) for practical examples.

## Benefits

- **Consistent visualization**: All log sources can have consistent severity-based coloring and grouping, regardless of how severity is stored
- **Flexible extraction**: Support both structured (JSON) and unstructured (plain text) log formats from the same source
- **Normalization**: Convert varied severity naming conventions (error/err/ERROR/3) to standard levels for easier analysis
- **Visual analysis**: Colored log bars and graph grouping make it easy to spot error patterns and severity trends at a glance

## Related documentation

- [Data Sources](/concepts/source) – Source types overview
  - [Docker Source](/concepts/source#docker-source) – Docker source details
  - [Kubernetes Source](/concepts/source#kubernetes-source) – Kubernetes source details
  - [ClickHouse Source](/concepts/source#clickhouse-source) – ClickHouse source details
- [Source Configuration UI](/ui/source#severity-rules-dockerkubernetes-only) – How to configure severity rules in the UI
- [Severity Rules How-to Guide](/howto/severity-rules) – Practical examples and patterns
