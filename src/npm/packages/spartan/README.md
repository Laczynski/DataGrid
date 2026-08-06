# @query-grid/spartan

Spartan-aligned adapter for [QueryGrid](https://github.com/laczynski/QueryGrid): `<qg-spartan-data-grid>` with column filters, search, filter chips, multi-sort, pagination, export, views, and column chooser.

## Install

```powershell
npm install @query-grid/core @query-grid/spartan
```

Peer dependencies: Angular 22+, `@angular/cdk` 22+, RxJS 7+.

## Quick start

```typescript
import { Component, inject, DestroyRef } from "@angular/core";
import {
  GridResourceFactory,
  QgColumnDirective,
  SpartanDataGridComponent,
} from "@query-grid/spartan";

@Component({
  imports: [SpartanDataGridComponent, QgColumnDirective],
  template: `
    <qg-spartan-data-grid [grid]="grid" dataKey="id" searchPlaceholder="Search…">
      <ng-template qgColumn="name" header="Name" let-row>{{ row.name }}</ng-template>
    </qg-spartan-data-grid>
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
import { provideQgI18nWithNgxTranslate } from "@query-grid/spartan/ngx-translate";

export const appConfig = {
  providers: [provideQgI18nWithNgxTranslate({ prefix: "qg" })],
};
```

Add keys under `qg.*` in your translation files (see `samples/showcase-ui/public/i18n/en.json`).

## Customize helm (L2 / L3)

```powershell
ng generate @query-grid/cli:spartan-grid --level=filter-editors
ng generate @query-grid/cli:spartan-grid --level=full
```

L3 (`full`) copies `hlm-query-grid` — see [spartan-l3-hlm.md](https://github.com/laczynski/QueryGrid/blob/main/docs/guides/spartan-l3-hlm.md).

## Full guide

[Getting started](https://github.com/laczynski/QueryGrid/blob/main/docs/getting-started.md)
