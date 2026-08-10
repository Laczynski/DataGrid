# @laczynski/datagrid-cli

Angular schematics for customizing DataGrid Spartan helm in consumer apps.

## Spartan grid helm

```powershell
npm install -D @laczynski/datagrid-cli
ng generate @laczynski/datagrid-cli:spartan-grid --level=filter-editors
ng generate @laczynski/datagrid-cli:spartan-grid --level=full
```

| Level            | Copies                                                                                |
| ---------------- | ------------------------------------------------------------------------------------- |
| `filter-editors` | `filter-editors/dg-column-filter` (Spartan `hlm*` popover UI)                         |
| `full` (L3)      | `filter-editors/` + `grid-shell/hlm-data-grid` (+ views, column chooser, pagination) |

Default output: `src/app/shared/datagrid/`.

- **L1** — use `<dg-spartan-data-grid>` from npm only (built-in `dg-sh-*` helm).
- **L2** — `filter-editors` level for custom column filter UI.
- **L3** — `full` level; local `<dg-hlm-data-grid>` with Spartan `hlm*` ([spartan-l3-hlm.md](https://github.com/laczynski/DataGrid/blob/main/docs/guides/spartan-l3-hlm.md)).

Grid state and `GridQuery` stay in `@laczynski/datagrid-spartan`.

See [spartan-ui-alignment.md](https://github.com/laczynski/DataGrid/blob/main/docs/guides/spartan-ui-alignment.md).
