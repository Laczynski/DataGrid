# @laczynski/datagrid

Framework-agnostic TypeScript types for [DataGrid](https://github.com/laczynski/DataGrid) — `GridQuery`, `GridResult`, filter/sort nodes, and display helpers.

## Install

```powershell
npm install @laczynski/datagrid
```

## Example

```typescript
import type { GridQuery, GridResult } from "@laczynski/datagrid";
import { formatGridError } from "@laczynski/datagrid";

const query: GridQuery = { take: 20, sort: [{ field: "LastActivityAt", desc: true }] };
```

Serialize with `JSON.stringify` in your HTTP layer. This package does not ship transport helpers.

## Full guide

[Getting started](https://github.com/laczynski/DataGrid/blob/main/docs/getting-started.md) — install, JSON shape, field naming, and Angular integration via `@laczynski/datagrid-primeng`.
