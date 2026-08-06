# Spartan L3 — `hlm*` grid shell

> Scope: after `ng generate @query-grid/cli:spartan-grid --level=full`. You own `grid-shell/` and `filter-editors/`; brain stays in `@query-grid/spartan`.

## What L3 gives you

| Path                          | Purpose                                                                  |
| ----------------------------- | ------------------------------------------------------------------------ |
| `filter-editors/`             | Column filter popover UI (`hlm-popover`, `hlm-checkbox`, native fields). |
| `grid-shell/hlm-query-grid.*` | Full grid chrome using Spartan `hlm*` directly — `<qg-hlm-query-grid>`.  |
| `grid-shell/qg-helm-utils.ts` | Shared `hlm*` imports, icon provider, select/size helpers.               |
| `HLM-MIGRATION.md`            | This guide (copied into your app by the schematic).                      |

L3 uses Spartan `hlmBtn`, `hlmInput`, `hlm-checkbox`, `hlm-select`, `hlm-popover`, `hlm-dropdown-menu`, `hlm-spinner`, `hlmTooltip`, and `ng-icon` directly. There is no `helm/` folder or `qg-sh-*` adapter layer.

## Spartan helm setup

Install Spartan helm in your app first:

```powershell
ng g @spartan-ng/cli:ui button input checkbox select popover tooltip spinner dropdown-menu
```

Add Tailwind + Spartan CSS variables on `:root` (see [spartan.ng](https://www.spartan.ng/documentation/introduction)).

Configure tsconfig path aliases for `@spartan-ng/helm/*` pointing at your copied helm primitives (see showcase `samples/showcase-ui/tsconfig.json`).

### Showcase reference

The `/spartan` tab demonstrates full L3:

- `npm run setup:spartan-helm` — Spartan NG theme + `src/app/shared/spartan/` (`@spartan-ng/helm/*` path aliases).
- `sync-spartan-consumer.mjs` — syncs `grid-shell/` + `filter-editors/` from `@query-grid/cli`.

## Brain vs presentation

Keep importing from `@query-grid/spartan`:

- `createGridResource`, `GridResourceFactory`
- `QgColumnDirective`, `QgEmptyDirective`, `QgToolbarDirective`, `QgBulkToolbarDirective`
- `provideQgI18nWithNgxTranslate` from `@query-grid/spartan/ngx-translate`

Only the **grid shell** and **filter editors** live under your `shared/query-grid/` tree.

## Wiring the copied grid

```typescript
import { HlmQueryGridComponent } from "./shared/query-grid/grid-shell/hlm-query-grid.component";
import { QgColumnDirective, GridResourceFactory } from "@query-grid/spartan";

@Component({
  imports: [HlmQueryGridComponent, QgColumnDirective],
  template: `
    <qg-hlm-query-grid [grid]="grid" dataKey="id">
      <ng-template qgColumn="name" header="Name" let-row>{{
        row.name
      }}</ng-template>
    </qg-hlm-query-grid>
  `,
})
export class ListPage {
  /* ... */
}
```

## Helpers (`qg-helm-utils.ts`)

| Export                               | Use                                                                                   |
| ------------------------------------ | ------------------------------------------------------------------------------------- |
| `QG_GRID_HELM_IMPORTS`               | Spread into component `imports` for shared `hlm*` + `ng-icon`                         |
| `provideQgGridHelmIcons()`           | Lucide icons used by the grid shell                                                   |
| `QG_SELECT_EMPTY_VALUE`              | Sentinel for “no selection” — `hlm-select-item` **cannot** use `value=""`             |
| `qgSelectItemValue(value)`           | Map filter/model values to select item values                                         |
| `isQgSelectEmptyValue(value)`        | True for null, `""`, or the sentinel                                                  |
| `qgSelectItemToString(items)`        | Label resolver for `hlm-select` `[itemToString]`                                      |
| `qgSelectTriggerClass(size, extra?)` | Sizing classes for `hlm-select-trigger` — do **not** use `qgFieldClass()` on triggers |
| `qgFieldClass(size)`                 | Native `<input>` / `<textarea>` fields inside filters                                 |
| `qgBtnSize`, `qgIconBtnSize`         | Map grid density to Spartan button sizes                                              |

## Tailwind + native `<dialog>`

Tailwind preflight resets `<dialog>` to `inset: 0; margin: 0`, which pins modals to the viewport corner. The grid views dialog includes a fix in `grid-views.component.scss`:

```scss
.qg-grid-views__dialog:modal,
.qg-grid-views__dialog[open] {
  position: fixed;
  inset: 0;
  width: fit-content;
  height: fit-content;
  max-height: calc(100vh - 2rem);
  margin: auto;
}
```

Keep this if you customize the views dialog styles.

## Table (v2, optional)

L3 copies a native `<table>` grid (same as L1). Spartan `hlm-table` + TanStack is optional future work — not required for L3 ownership.

## References

- [spartan-ui-alignment.md](https://github.com/laczynski/QueryGrid/blob/main/docs/guides/spartan-ui-alignment.md)
- [@query-grid/cli README](https://github.com/laczynski/QueryGrid/blob/main/src/npm/packages/cli/README.md)
- [spartan.ng components](https://www.spartan.ng/components)
