---
title: Severity rules by example
description: Practical examples and patterns for extracting and normalizing severity from Docker and Kubernetes logs
---

This guide provides practical examples for configuring severity rules to extract severity from log messages. Each example shows real log formats and complete rule configurations.

:::tip[New to severity rules?]
To understand what severity rules are and how they work, start with the [Severity rules concept](/concepts/severity-rules) page. For UI configuration instructions, see the [Source configuration guide](/ui/source#severity-rules-dockerkubernetes-only).
:::

## Example 1: simple JSON logs

Extract severity from JSON logs with a top-level `level` field.

**Container output (raw string in `body` field):**
```json
{"level": "error", "message": "Connection failed", "timestamp": "2024-01-01T12:00:00Z"}
```

**Extraction rule:**
- Type: **Field**
- Path: `level`

**Remap rules:**
- `error` → `ERROR`
- `warn` → `WARN`
- `info` → `INFO`

The JSON extraction rule parses the string as JSON and navigates to the `level` field, extracting "error" which is then remapped to "ERROR".

## Example 2: nested JSON structure

Extract severity from nested JSON paths.

**Container output:**
```json
{"log": {"level": "warn", "timestamp": "2024-01-01"}, "service": "api"}
```

**Extraction rule:**
- Type: **Field**
- Path: `log,level` (comma-separated path navigates nested structure)

**Remap rules:**
- `warn` → `WARN`
- `error` → `ERROR`

This navigates `log` → `level` to extract "warn" and remaps it to "WARN".

## Example 3: bracketed severity format

Extract severity from plain text logs with bracketed prefix.

**Container output (raw string in `body` field):**
```
[ERROR] Connection failed to database
```

**Extraction rule:**
- Type: **Regex**
- Pattern: `\[(\w+)\]`
- Capture group: `1`

The regex searches the raw string, matches `[ERROR]`, and capture group 1 extracts "ERROR" (the text inside brackets). No remapping needed since the extracted value is already in the correct format.

## Example 4: multiple formats with fallback

Handle multiple log formats from different containers using multiple extraction rules.

**Container outputs:**
```json
{"level": "error", "msg": "test"}
```
```
level=ERROR msg=Connection failed
```
```
Plain log message
```

**Extraction rules (evaluated in order):**
1. Type: **Field**, Path: `level`
2. Type: **Regex**, Pattern: `level=(\w+)`, Capture group: `1`

**Remap rules:**
- `error` → `ERROR` (normalize lowercase to uppercase)

When processing logs:
- JSON format → Extracts "error", remaps to "ERROR"
- Key-value format → Extracts "ERROR", already uppercase so no remap needed
- Plain text → Both rules fail, severity defaults to "UNKNOWN"

## Example 5: case-insensitive normalization

Normalize severity regardless of case variations.

**Container output:**
```json
{"level": "Error", "msg": "test"}
{"level": "ERROR", "msg": "test"}
{"level": "error", "msg": "test"}
```

**Extraction rule:**
- Type: **Field**
- Path: `level`

**Remap rules:**
- Pattern: `error`, Value: `ERROR`, Case-insensitive: `true`
- Pattern: `warn`, Value: `WARN`, Case-insensitive: `true`

All case variations ("Error", "ERROR", "error") are matched and normalized to "ERROR".

## Example 6: syslog-style numeric priorities

Remap numeric syslog priority values to severity names.

**Container output:**
```json
{"priority": "3", "msg": "Error occurred"}
{"priority": "5", "msg": "Notice"}
{"priority": "7", "msg": "Debug info"}
```

**Extraction rule:**
- Type: **Field**
- Path: `priority`

**Remap rules:**
- `[0-3]` → `ERROR` (Emergency, Alert, Critical, Error)
- `[4-5]` → `WARN` (Warning, Notice)
- `[6-7]` → `INFO` (Informational, Debug)

Numeric priorities are extracted as strings (e.g., "3") and matched using regex character classes. Priority "3" matches `[0-3]` and remaps to "ERROR".

## Tips & tricks

### Extraction rules
1. **Order matters**: Place more specific rules before generic ones
2. **Regex escaping**: Escape special characters in patterns (e.g., `\[` for literal brackets)
3. **Capture groups**: Use group 1 for most cases (group 0 includes the full match)

### Remapping rules
1. **Case handling**: Enable case-insensitive matching when log sources vary in capitalization
2. **Pattern order**: More specific patterns should come first (e.g., `error` before `err.*`)
3. **Regex patterns**: Use patterns like `warn.*` to match variations ("warn", "warning", "WARN")
4. **Fallback values**: If no remap matches, the extracted value is used as-is

### Performance
1. **Minimize rules**: Use the fewest rules necessary to cover your log formats
2. **Efficient patterns**: Simple patterns are faster than complex regex
3. **Early matching**: Rules stop evaluating after first match

## Related documentation

- [Severity rules concept](/concepts/severity-rules) - Understand how severity rules work (extraction phases, evaluation order, etc.)
- [Source configuration UI](/ui/source#severity-rules-dockerkubernetes-only) - Step-by-step UI instructions for configuring severity rules
- [Kubernetes setup](/howto/kubernetes) - Setting up Kubernetes log sources
- [Docker sources](/concepts/source#docker-source) - Docker source overview
