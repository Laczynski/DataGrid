# Spartan UI alignment for QueryGrid

> **Status:** **Shipped** — L1 `<qg-spartan-data-grid>` in npm; L3 consumer layout (`qg-hlm-query-grid` + local `hlm*`) in showcase `/spartan` and `@query-grid/cli:spartan-grid --level=full`.
>
> **Goal:** Spartan-aligned UI adapter for list screens without changing `GridQuery` transport or backend contracts.

## Why this document exists

Consumers migrating from PrimeNG to [spartan/ui](https://www.spartan.ng) use `@query-grid/primeng` (`<qg-prime-data-grid>`) today. QueryGrid provides a sibling adapter that follows the same **brain + helm** idea as Spartan:

- **Brain** — grid state, filter algebra, column contract (stable, UI-kit agnostic where possible).
- **Helm** — presentation the app owns or can copy (Spartan tokens, `hlm*` components, Tailwind).

`@query-grid/spartan` must feel like spartan/ui — not a second opinionated widget library.

---

## Repository shape

```
@query-grid/core          ← transport + models (framework-agnostic)
        │
        ├── @query-grid/primeng   ← PrimeNG adapter (<qg-prime-data-grid>)
        ├── @query-grid/ui        ← laczynski/ui adapter (<qg-ui-data-grid>)
        ├── @query-grid/spartan   ← Spartan adapter (<qg-spartan-data-grid>, L1)
        └── @query-grid/cli       ← spartan-grid schematic (L2/L3 consumer copies)
```

> **Note:** `@query-grid/angular` was removed (see `CHANGELOG.md`). Each UI adapter is a **self-contained** Angular package with its own `createGridResource`, `GridResourceFactory`, column directives, and grid shell.

---

## Spartan principles (applied to QueryGrid)

| Spartan idea                   | QueryGrid mapping                                                                          |
| ------------------------------ | ------------------------------------------------------------------------------------------ |
| Headless brain from npm        | `@query-grid/core` + grid resource / filter logic inside each adapter                      |
| Helm copied / owned by the app | Default `qg-sh-*` helm in L1; CLI copies `filter-editors/` or full `grid-shell/` for L2/L3 |
| Tailwind + CSS variables       | Grid chrome uses Spartan tokens (`--background`, `--border`, `--muted-foreground`, …)      |
| No black-box styling           | Toolbar, filter popovers, chips — readable templates, overridable                          |
| UI-kit adapters are thin       | Spartan package does not reimplement filter algebra or paging math                         |
| Icons via ng-icons (Lucide)    | No PrimeIcons in the Spartan adapter                                                       |

QueryGrid stays a **data-grid toolkit** with **pluggable helm adapters** (`primeng`, `ui`, `spartan`).

---

## Package responsibilities

### `@query-grid/core` (unchanged)

- `GridQuery`, `GridResult`, filter/sort nodes
- `serializeGridQuery` / `deserializeGridQuery`
- `formatGridError`, `formatLocalDateTime`, export helpers

### `@query-grid/primeng` / `@query-grid/ui` (existing adapters)

Reference implementations. Spartan work must **not** break their public API.

### `@query-grid/spartan` (L1)

**Owns:**

- `<qg-spartan-data-grid>` — counterpart to `<qg-prime-data-grid>` / `<qg-ui-data-grid>`
- `createGridResource()`, `GridResourceFactory` (same pattern as `ui` / `primeng`)
- `QgColumnDirective`, `QgEmptyDirective`, `QgToolbarDirective`, `QgBulkToolbarDirective`
- Spartan-themed: toolbar, search, clear, filter feed, column-header filters, chips, table chrome, loading, empty slot
- Built-in `qg-sh-*` helm (Spartan CSS tokens) — no consumer `@spartan-ng/helm/*` setup required
- `@query-grid/spartan/ngx-translate` i18n entry (mirror `ui` / `primeng`)

**Peer dependencies:**

- `@query-grid/core`
- `@angular/*`, `rxjs`
- `@spartan-ng/brain`, `@ng-icons/core`, `@ng-icons/lucide`

**Must not:**

- Change `GridQuery` JSON shape
- Require PrimeNG or `@laczynski/ui`
- Leak Spartan types into `@query-grid/core`
- Depend on any specific downstream application

### `@query-grid/cli` (L2 / L3)

- `filter-editors` — column filter popover UI with Spartan `hlm*`
- `full` — `filter-editors/` + `grid-shell/hlm-query-grid` (+ views, column chooser, pagination)

See [spartan-l3-hlm.md](./spartan-l3-hlm.md).

---

## Brain vs helm (consumer view)

### Brain (stable consumer API)

```typescript
grid = this.gridFactory.create<IssueDto>({
  destroyRef: this.destroyRef,
  load: (query) => this.issuesService.getAllIssues(query),
  defaultSort: [{ field: "LastActivityAt", desc: true }],
  defaultTake: 10,
  persistState: { key: "my-app.issues-list", storage: "session" },
});
```

```html
<ng-template
  qgColumn="Status"
  header="Status"
  [filter]="{ type: 'enum', options: statusOptions }"
  let-row
>
  <!-- App-owned cell: hlmBadge, routerLink, … -->
</ng-template>
```

### Helm

**L1** — use the npm component:

```html
<qg-spartan-data-grid
  [grid]="grid"
  dataKey="id"
  searchPlaceholder="Search issues…"
>
  <!-- qgColumn / qgEmpty / qgToolbar / qgBulkToolbar -->
</qg-spartan-data-grid>
```

**L3** — use copied `<qg-hlm-query-grid>` with consumer `hlm*` (see [spartan-l3-hlm.md](./spartan-l3-hlm.md)).

---

## UI building blocks

| Grid area           | `@query-grid/primeng`    | L1 `@query-grid/spartan`  | L3 consumer shell        |
| ------------------- | ------------------------ | ------------------------- | ------------------------ |
| Global search       | Prime inputs             | `qg-sh-search`            | `hlmInput` + `ng-icon`   |
| Actions             | `pButton`                | `qg-sh-btn`               | `hlmBtn`                 |
| Column filters      | Prime overlays           | `qg-sh-popover` + fields  | `hlm-popover` + `hlm-*`  |
| Enum filter         | `p-multiselect`          | `qg-sh-select`            | `hlm-select`             |
| Filter chips / feed | Prime chip / custom feed | `filter-feed` patterns    | same brain, local chrome |
| Sort                | Prime sort meta          | Header clicks → `setSort` | same                     |
| Loading             | `p-table [loading]`      | overlay + `qg-sh-spinner` | `hlm-spinner`            |
| Pagination          | `p-table` paginator      | `qg-sh-pagination`        | local pagination util    |
| Table               | `p-table` lazy           | Native `<table>`          | Native `<table>`         |

### Pagination

Full parity with `@query-grid/ui` and `@query-grid/primeng`, wired to `GridResource.setPage` / `setTake`:

| Capability          | Behavior                                |
| ------------------- | --------------------------------------- |
| Current page        | `resource.page()`                       |
| Total pages / items | `pageCount()`, `totalCount()`           |
| Page size selector  | `[pageSizeOptions]` input               |
| Numbered pages      | `showPageNumbers`, `maxVisiblePages: 5` |
| First / last        | `showFirstLast`                         |
| Range info          | `showInfo` via i18n tokens              |
| Events              | `(pageChange)`, `(pageSizeChange)`      |

L1 implements this with internal `qg-sh-*` helm. L3 uses Spartan `hlm-select` for page size and the copied pagination helper.

### Table strategy

v1 matches **`@query-grid/ui`** — direct `GridResource` wiring, **not** PrimeNG `lazy-load-mapper`. TanStack + Spartan `hlm-table` = optional v2.

---

## Styling rules

1. Spartan CSS variables only — no `--p-*`.
2. Tailwind utilities in templates (`border-border`, `text-muted-foreground`, `bg-card`).
3. Dark mode via consumer `.dark` — no adapter theme engine.
4. Density via host classes later (`compact` / `comfortable`).

L3 apps using Tailwind preflight must reset native `<dialog>` positioning for saved-views modals — see [spartan-l3-hlm.md](./spartan-l3-hlm.md).

---

## Helm ownership (Spartan-style)

| Level  | What the app gets                            | When                  |
| ------ | -------------------------------------------- | --------------------- |
| **L1** | `@query-grid/spartan` npm only               | Fastest integration   |
| **L2** | CLI copies `filter-editors/`                 | Customize filter UX   |
| **L3** | CLI copies `grid-shell/` + `filter-editors/` | Full visual ownership |

```powershell
ng generate @query-grid/cli:spartan-grid --level=filter-editors
ng generate @query-grid/cli:spartan-grid --level=full
```

---

## API parity

`<qg-spartan-data-grid>` mirrors `<qg-prime-data-grid>` / `<qg-ui-data-grid>` for UI-kit-agnostic inputs:

- `[grid]`, `dataKey`, `searchPlaceholder`, `searchable`, `searchFields`
- `pageSizeOptions`, `extraChips`, `(extraChipRemove)`, `(cleared)`
- `qgColumn`, `qgEmpty`, `qgToolbar`, `QgBulkToolbarDirective`
- Column chooser, views, export, row selection, scroll persistence

---

## Maintainer workflow

| Task                                | Command / script                                                                                        |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Edit L1 grid shell                  | `src/npm/packages/spartan/src/`                                                                         |
| Sync directives into CLI schematic  | `node scripts/sync-spartan-schematic-files.mjs` (runs on CLI `prebuild`)                                |
| Edit L3 schematic sources           | `src/npm/packages/cli/schematics/spartan-grid/files/`                                                   |
| Refresh showcase L3 copy            | `node samples/showcase-ui/scripts/sync-spartan-consumer.mjs` (runs on showcase `prebuild` / `prestart`) |
| Spartan helm primitives in showcase | `npm run setup:spartan-helm` in `samples/showcase-ui`                                                   |

**Root scripts:** `build:spartan`, `build:cli`, `watch:spartan` — included in `build:npm` / `dev:frontend` / `pack:npm`.

**Showcase:** `/spartan` uses L3 consumer layout — see [samples/README.md](../../samples/README.md).

---

## Phases (complete)

| Phase | Deliverable                                                         |
| ----- | ------------------------------------------------------------------- |
| 0     | This document + sign-off                                            |
| 1     | `packages/spartan/` skeleton, build, `<qg-spartan-data-grid>`       |
| 2     | Toolbar, chips/feed, table + sort + full pagination                 |
| 3     | Column filter editors (parity with `ui` filter types)               |
| 4     | Showcase route `/spartan`                                           |
| 5     | `@query-grid/cli:spartan-grid`, `@query-grid/spartan/ngx-translate` |
| 6     | L3 `hlm-query-grid` with consumer `hlm*` (showcase + CLI `full`)    |

---

## Non-goals

- .NET / transport changes
- Removing `@query-grid/primeng` or `@query-grid/ui`
- Extracting shared `@query-grid/angular` brain (unless separate refactor)
- Embedded “show more” lists (comments, history tabs)

---

## Decisions (locked)

| Topic             | Decision                                                                                                       |
| ----------------- | -------------------------------------------------------------------------------------------------------------- |
| Package name      | `@query-grid/spartan`                                                                                          |
| Consumer coupling | **None** — generic examples only                                                                               |
| L1 helm           | Ship default `qg-sh-*` inside npm — no consumer `@spartan-ng/helm/*` required                                  |
| L3 helm           | Consumer installs `@spartan-ng/helm/*` path aliases; schematic uses `hlm*` directly                            |
| Code sharing      | Duplicate from `ui` / `spartan` into schematic; sync script for directives — no shared internal npm module yet |
| Pagination        | Full parity with `@query-grid/ui` / `@query-grid/primeng`                                                      |
| Feature scope     | Match sibling adapters over time                                                                               |

---

## References

- [spartan-l3-hlm.md](./spartan-l3-hlm.md) — L3 consumer setup and helpers
- [spartan/ui docs](https://www.spartan.ng/documentation/introduction)
- [npm-guidelines.md](npm-guidelines.md), [repo-map.md](repo-map.md)
- Sibling packages: `src/npm/packages/ui/`, `src/npm/packages/spartan/`
