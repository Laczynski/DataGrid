# Repository Map

> Scope: where things live and which package owns what. This is the quickest orientation document after `AGENTS.md`.

## Top level

- Root `package.json` defines the npm workspace and orchestration scripts (`build:all`, `test:all`, `start:all`, `lint:frontend`, `pack:backend`) so you can run common dotnet and npm tasks from the repository root.
- `src/dotnet/` contains the .NET solution and publishable NuGet packages.
- `src/npm/` contains the npm workspace and publishable `@laczynski/datagrid*` packages.
- `samples/` contains runnable demo applications that reference the library packages (local path or published versions).
- `docs/` contains implementation guides and technical documentation.
- `artifacts/` is the default output folder for packed NuGet packages (gitignored).

## .NET map

### Solution shape

- `src/dotnet/DataGrid.slnx` is the solution entry point.
- `Directory.Packages.props` manages NuGet package versions centrally.
- `Directory.Build.props` applies shared metadata and version to packable projects.

### Package responsibilities

| Package                        | Owns                                                                                                                                                                                                      |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DataGrid.Abstractions`        | `GridQuery`, `GridResult`, filter/sort types, `GridExportRequest` / `GridExportResult`, `GridExportFormats`, `GridExportContentTypes.GetFilename`, attributes, `GridQueryJson`, `FilterNodeJsonConverter` |
| `DataGrid.Core`                | Schema discovery, expression builders, `IQueryable` extensions, `GridOptions`, CSV/Excel export, `IGridExportWriter`, `GridExportWriterRegistry`, `GridExportPipeline`, `GridExportWriterRegistration`    |
| `DataGrid.EntityFrameworkCore` | `ToGridResultAsync`, `ExportAsync`, `ExportToCsvAsync`, `ExportToXlsxAsync`                                                                                                                               |

### Export layout

Shared export planning (`GridExportExecutor`) lives in `DataGrid.Core`. Built-in writers: CSV (BCL) and Excel (ClosedXML).

| Format | Package                        | Entry point                                                                                                                      |
| ------ | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| Any    | `DataGrid.EntityFrameworkCore` | `ExportAsync`                                                                                                                    |
| CSV    | `DataGrid.Core` / EF           | `ExportToCsv` / `ExportToCsvAsync`                                                                                               |
| Excel  | `DataGrid.Core` / EF           | `ExportToXlsx` / `ExportToXlsxAsync`                                                                                             |
| Custom | consumer                       | `IGridExportWriter` + `GridExportPipeline`, register via `GridExportWriterRegistration.Configure` or `GridExportOptions.Writers` |

The npm grid shows **Export** and **Export selected** dropdowns (CSV and Excel) when `export` is configured.

### Internal layout (Core)

- `Schema/` — field discovery and `GridFieldInfo`
- `Internal/` — expression builders, type classification, value conversion, `CsvGridExporter`, `XlsxGridExporter` (not public API)

### Tests

- `src/dotnet/tests/DataGrid.UnitTests/` — xUnit tests colocated by concern (`FilterTests`, `SortAndPagingTests`, `GridQueryContractTests`, etc.)
- Uses EF Core InMemory for integration-style tests without a real database.

## npm map

### Workspace shape

- `src/npm/package.json` is a pointer only — workspaces and scripts live at the repository root.
- Each package has its own `package.json`, build config, and `src/` folder.

### Package responsibilities

| Package                       | Owns                                                                                                                                                        |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@laczynski/datagrid`         | TypeScript models mirroring `GridQuery` / `GridResult`, `formatGridError`, `formatLocalDateTime`, `buildGridExportBody`, `downloadGridExport`               |
| `@laczynski/datagrid-primeng` | `createGridResource()`, `GridResourceFactory`, `<dg-prime-data-grid>`, `dgColumn` / `dgEmpty` directives, filter feed                                       |
| `@laczynski/datagrid-ui`      | `createGridResource()`, `GridResourceFactory`, `<dg-ui-data-grid>`, `dgColumn` / `dgEmpty` directives, filter feed (`@laczynski/lui`)                        |
| `@laczynski/datagrid-spartan` | `createGridResource()`, `GridResourceFactory`, `<dg-spartan-data-grid>`, column filters, export, views — [spartan-ui-alignment.md](spartan-ui-alignment.md) |
| `@laczynski/datagrid-cli`     | Angular schematics — `spartan-grid` (`filter-editors` L2 / `full` L3); see [spartan-l3-hlm.md](spartan-l3-hlm.md)                                           |

### PrimeNG package layout

- `create-grid-resource.ts`, `grid-resource-factory.ts` — signal-based grid state store
- `grid-state-storage.ts` — optional session / local persistence (`persistState`)
- `table/` — `dgColumn`, `dgEmpty`, column filter component, column resolution
- `sort-mapper.ts`, `filter-mapper.ts`, `match-mode-options.ts`, `lazy-load-mapper.ts` — PrimeNG lazy-load bridge (barrel re-exports from the first three)
- `filter-feed.ts` — interactive filter query feed UX

### Tests

- `@laczynski/datagrid` — Vitest (`models.spec.ts`, `grid-error-codes.spec.ts`, `format-local-datetime.spec.ts`).
- `@laczynski/datagrid-primeng` — Vitest (`lazy-load-mapper.spec.ts`, `filter-feed.spec.ts`); integration via `samples/showcase-ui`.

## Samples map

- `samples/README.md` describes the **showcase** apps (`showcase-api`, `showcase-ui`) — a compatibility matrix for data types, operators, and grid scenarios (not a business-domain demo).
- Samples consume published or locally packed packages — they are **not** part of the library API surface.
- Use samples instead of downstream consumer repos for manual end-to-end verification before release.

## Dependency graph

```
DataGrid.Abstractions
        │
        ├── DataGrid.Core
        │         └── DataGrid.EntityFrameworkCore
        │
@laczynski/datagrid
        │
        ├── @laczynski/datagrid-primeng
        ├── @laczynski/datagrid-ui
        ├── @laczynski/datagrid-spartan
        └── @laczynski/datagrid-cli (schematics; devDependency in consumer apps)
```

Transport contracts must stay aligned between `DataGrid.Abstractions` and `@laczynski/datagrid`.
