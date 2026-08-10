# Changelog

All notable changes to this project are documented here.

## 0.1.0-preview.15 — 2026-08-10

### Fixed

- CI: `nuget.config` uses nuget.org only (no local feed path required in GitHub Actions)
- CI: symbol package push no longer fails the release when the base package is not yet indexed

## 0.1.0-preview.14 — 2026-08-10

### Changed (breaking)

- Repository moved to **laczynski/DataGrid**; product renamed from QueryGrid to **DataGrid**
- NuGet: `QueryGrid.*` → `DataGrid.Abstractions`, `DataGrid.Core`, `DataGrid.EntityFrameworkCore`
- npm: `@query-grid/*` → `@laczynski/datagrid`, `@laczynski/datagrid-primeng`, `@laczynski/datagrid-ui`, `@laczynski/datagrid-spartan`, `@laczynski/datagrid-cli`
- Angular selectors/directives: `qg-*` → `dg-*` (e.g. `<dg-prime-data-grid>`, `dgColumn`, `<dg-hlm-data-grid>`)
- CLI schematic default path: `shared/query-grid` → `shared/datagrid`

## 0.1.0-preview.13 — 2026-08-06

### Added

- **@laczynski/datagrid-spartan** — Spartan-aligned grid adapter (`<dg-spartan-data-grid>`) with toolbar, filter feed, column filters, multi-sort, full pagination parity with `@laczynski/datagrid-ui`, export, saved views, column chooser, row selection, and scroll persistence; default `dg-sh-*` helm with Spartan CSS tokens; optional `@laczynski/datagrid-spartan/ngx-translate` entry point
- **@laczynski/datagrid-cli** — `spartan-grid` schematic (`filter-editors` L2 / `full` L3); `scripts/sync-spartan-schematic-files.mjs` keeps schematic files aligned with `@laczynski/datagrid-spartan` source
- **showcase-ui** — `/spartan` route using L3 consumer path (`dg-hlm-data-grid` with Spartan `hlm*` via `setup:spartan-helm`; synced `grid-shell` + `filter-editors`; brain from npm)
- Documentation: [spartan-ui-alignment.md](docs/guides/spartan-ui-alignment.md), [spartan-l3-hlm.md](docs/guides/spartan-l3-hlm.md)

### Fixed (L3 consumer shell)

- Pagination page-size selector stays in sync with `take` via `hlm-select`
- Saved-views `<dialog>` centers correctly under Tailwind preflight
- `hlm-select-item` uses `DG_SELECT_EMPTY_VALUE` sentinel instead of empty `value`
- Search field and select trigger layout aligned with Spartan helm sizing helpers

## 0.1.0-preview.12 — 2026-08-04

### Fixed

- **@laczynski/datagrid-primeng** — resizing a column no longer bubbles a trailing click to the sortable header and changes its sort order.
- **@laczynski/datagrid-primeng** — switching saved views now refreshes multi-sort badges, so their displayed order matches the restored sort descriptors.

## 0.1.0-preview.11 — 2026-08-04

### Changed

- **@laczynski/datagrid-primeng / showcase-ui** — upgraded to Angular 22.1, TypeScript 6.0, ng-packagr 22.1, and PrimeNG 22.
- **@laczynski/datagrid-ui / showcase-ui** — upgraded `@laczynski/ui` to `2.0.0-preview.6`, with Angular 22.1 peer dependencies.
- **@laczynski/datagrid-primeng** — the export controls now use `p-splitbutton`; clicking the main action exports CSV and the arrow exposes CSV and Excel choices.
- Package READMEs and publishing examples now state the Angular 22 / PrimeNG 22 requirements and the current preview version.

### Fixed

- **@laczynski/datagrid-primeng** — export options no longer render through the PrimeNG `Menu` component that fails at runtime with `parentId_r3` under Angular 22.

## 0.1.0-preview.10 — 2026-08-04

### Changed

- Package metadata, documentation, and publishing examples now reference the `laczynski/DataGrid` GitHub repository.

## 0.1.0-preview.9 — 2026-08-04

### Added

- **DataGrid.Abstractions / DataGrid.Core / DataGrid.EntityFrameworkCore** — server-side CSV and XLSX export pipeline with configurable formats, column metadata, selection or filtered-result scope, and validation errors
- **@laczynski/datagrid** — export request helpers, grid view presets, URL query-state helpers, column layout/visibility, row selection, and horizontal-scroll persistence models
- **@laczynski/datagrid-primeng / @laczynski/datagrid-ui** — export controls; saved views; URL state sync; column chooser, resize/reorder/pinning controls; row selection; persisted scroll position; and a filter feed
- **@laczynski/datagrid-primeng / @laczynski/datagrid-ui** — optional `ngx-translate` secondary entry point and translated showcase UI

### Changed

- **@laczynski/datagrid-primeng / @laczynski/datagrid-ui** — grid toolbar, filter panel, menus, and loading/scroll UX refined across the showcase adapters
- Documentation expanded for grid export, state management, and integration recipes

### Fixed

- Saved views now restore sorting consistently across adapters
- Grid scrollbars are clipped correctly and showcase grids keep their row area scrollable

## 0.1.0-preview.8 — 2026-07-22

### Added

- **DataGrid.Abstractions** — `[GridEnumOrder]`, `[GridSortKey]`, `[GridSortWith]` attributes for custom enum sort order, display-field-to-rank sort, and date+time companion sort
- **DataGrid.Core** — schema discovery and expression building for the new sort attributes; nullable string/enum normalization (trim, whitespace-only → `null`); Guid global search supports full equality and case-insensitive substring match on canonical `Guid.ToString()` when the search text looks like a Guid fragment
- **@laczynski/datagrid** — `getAllowedOperatorsForColumnType`, `coerceOperatorForColumnType`, `defaultOperatorForColumnType` (defensive operator coercion aligned with backend rules)
- **@laczynski/datagrid-primeng / @laczynski/datagrid-ui** — nullable enum match modes (`is` / `isNot`); operator coercion when PrimeNG or persisted state sends an invalid match mode for the column type
- **DataGrid.IntegrationTests** — shared `GridBehaviorScenarios` run against SQLite (in-memory), PostgreSQL, and SQL Server (Testcontainers); UX-focused unit tests for odd but realistic `GridQuery` payloads

### Changed

- **@laczynski/datagrid-ui** — lighter table loading UX (tbody-only refresh overlay, deferred spinner, stable row tracking via `dataKey`)
- **@laczynski/datagrid-ui** — peer dependency `@laczynski/ui` `^2.0.0-preview`
- **showcase-ui** — uses `@laczynski/ui` `2.0.0-preview`
- Showcase `Category` column demonstrates `[GridEnumOrder]`
- Docs: dotnet guidelines, feature recipes, testing guidelines (multi-provider integration coverage)

### Fixed

- **@laczynski/datagrid-ui** — disabled Clear no longer passes clicks through to column headers (sort no longer changes accidentally)
- **@laczynski/datagrid-ui** — Clear resets filters/search only, not sort
- **@laczynski/datagrid-primeng / @laczynski/datagrid-ui** — build `prebuild` ensures `@laczynski/datagrid` is compiled; tsconfig paths resolve core sources

## 0.1.0-preview.7 — 2026-07-19

### Changed

- CI: tag `v*` triggers full publish — NuGet (nuget.org + GitHub Packages) and npm (npmjs.com) via trusted publishing (OIDC)

## 0.1.0-preview.4 — 2026-07-19

### Added

- **DataGrid.IntegrationTests** — PostgreSQL + Testcontainers coverage for `GridQuery.Search` on projected EF queries with correlated subqueries
- **DataGrid.Core** — `ApplyEntitySearch` and `GridQuery.WithoutSearch()` for entity-level search before projection

### Fixed

- **DataGrid.Core / DataGrid.EntityFrameworkCore** — `GridQuery.Search` on projected `IQueryable` DTOs no longer fails on PostgreSQL when searchable fields include `Guid` (equality instead of `ToString().Contains()`; non-Guid text skips Guid fields)

## 0.1.0-preview.3 — 2026-07-18

### Added

- **@laczynski/datagrid-ui** — `<dg-ui-data-grid>` adapter on `@laczynski/ui` (column filters with Add Rule, search, chips, multi-sort, persistence)

### Changed

- Multi-sort UX aligned with PrimeNG `sortMode="multiple"`: plain header click replaces with a single column; Ctrl/Cmd + click adds or toggles within multi-sort (`@laczynski/datagrid-ui`, `@laczynski/datagrid-primeng`)
- PrimeNG column filters support Match All / Match Any with up to five rules per column
- String filters and global search use `string.ToLower()` instead of `ToLowerInvariant()` so EF Core can translate them to SQL `LOWER` (Npgsql, SQLite, SQL Server)

### Fixed

- **DataGrid.Core / DataGrid.EntityFrameworkCore** — `Contains` / `StartsWith` / `EndsWith` / `NotContains` and `[GridSearchable]` search no longer throw `Translation of method 'string.ToLowerInvariant' failed` under relational EF providers

## 0.1.0-preview.1 — 2026-07-01

First public preview.

### Added

- **DataGrid.Abstractions** — `GridQuery`, `GridResult`, filter/sort types, attributes, `GridValidationException`, `GridQueryJson.CreateOptions()`, `FilterNodeJsonConverter`
- **DataGrid.Core** — automatic DTO field discovery, filter/sort/search expression building, `ApplyGrid*` extensions, `GridOptions` safety limits, automatic `Id` tie-breaker sort
- **DataGrid.EntityFrameworkCore** — `ToGridResultAsync`
- **@laczynski/datagrid** — TypeScript models mirroring the transport contract, `formatGridError`, `formatLocalDateTime`
- **@laczynski/datagrid-primeng** — `createGridResource()` signal store, `<dg-prime-data-grid>` with column filters, global search, multi-sort, and optional `persistState`
- Showcase samples (`showcase-api`, `showcase-ui`), CI workflow, and documentation

### Notes

- JSON/HTTP transport is owned by the host app (serialize `GridQuery` with `GridQueryJson.CreateOptions()` on the server). See `samples/showcase-api/GridQueryBinding.cs` and [getting-started.md](docs/getting-started.md).
- Legacy packages removed before this release (`DataGrid.AspNetCore`, `@laczynski/datagrid-angular`, `qgCell`, URL sync in grid resource) — not part of the public API.
