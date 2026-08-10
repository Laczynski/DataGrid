# @laczynski/datagrid-primeng

PrimeNG lazy data grid for [DataGrid](https://github.com/laczynski/DataGrid) — column filters, global search, multi-sort, and optional session persistence.

## Install

```powershell
npm install @laczynski/datagrid @laczynski/datagrid-primeng primeng
```

Peer dependencies: Angular 22+, PrimeNG 22+, RxJS 7+.

## Example

```typescript
import { GridResourceFactory } from "@laczynski/datagrid-primeng";

readonly grid = this.gridFactory.create<IssueDto>({
  destroyRef: this.destroyRef,
  load: (q) => this.api.getAllIssues(q),
  defaultSort: [{ field: "LastActivityAt", desc: true }],
});
```

```html
<dg-prime-data-grid [grid]="grid" dataKey="id">
  <ng-template dgColumn="Title" header="Title" let-row>{{ row.title }}</ng-template>
</dg-prime-data-grid>
```

## Full guide

[Getting started](https://github.com/laczynski/DataGrid/blob/main/docs/getting-started.md) — backend setup, JSON transport, column templates, and field naming.
