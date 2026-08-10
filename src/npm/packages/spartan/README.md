# @laczynski/datagrid-spartan

Spartan-aligned adapter for [DataGrid](https://github.com/laczynski/DataGrid): `<dg-spartan-data-grid>` with column filters, search, filter chips, multi-sort, pagination, export, views, and column chooser.

## Install

```powershell
npm install @laczynski/datagrid @laczynski/datagrid-spartan
```

Peer dependencies: Angular 22+, `@angular/cdk` 22+, RxJS 7+.

## Quick start

```typescript
import { Component, inject, DestroyRef } from "@angular/core";
import {
  GridResourceFactory,
  DgColumnDirective,
  SpartanDataGridComponent,
} from "@laczynski/datagrid-spartan";

@Component({
  imports: [SpartanDataGridComponent, DgColumnDirective],
  template: `
    <dg-spartan-data-grid [grid]="grid" dataKey="id" searchPlaceholder="Search…">
      <ng-template dgColumn="name" header="Name" let-row>{{ row.name }}</ng-template>
    </dg-spartan-data-grid>
  `,
})
export class IssuesPage {
  private readonly gridFactory = inject(GridResourceFactory);

  readonly grid = this.gridFactory.create({
    destroyRef: inject(DestroyRef),
    load: (query) => this.api.list(query),
  });
}
```

## i18n (`ngx-translate`)

```typescript
import { provideDgI18nWithNgxTranslate } from "@laczynski/datagrid-spartan/ngx-translate";

export const appConfig = {
  providers: [provideDgI18nWithNgxTranslate({ prefix: "qg" })],
};
```

Add keys under `qg.*` in your translation files (see `samples/showcase-ui/public/i18n/en.json`).

## Customize helm (L2 / L3)

```powershell
ng generate @laczynski/datagrid-cli:spartan-grid --level=filter-editors
ng generate @laczynski/datagrid-cli:spartan-grid --level=full
```

L3 (`full`) copies `hlm-data-grid` — see [spartan-l3-hlm.md](https://github.com/laczynski/DataGrid/blob/main/docs/guides/spartan-l3-hlm.md).

## Full guide

[Getting started](https://github.com/laczynski/DataGrid/blob/main/docs/getting-started.md)
