# @query-grid/cli

Angular schematics for customizing QueryGrid Spartan helm in consumer apps.

## Spartan grid helm

```powershell
npm install -D @query-grid/cli
ng generate @query-grid/cli:spartan-grid --level=filter-editors
ng generate @query-grid/cli:spartan-grid --level=full
```

| Level            | Copies                                                                                |
| ---------------- | ------------------------------------------------------------------------------------- |
| `filter-editors` | `filter-editors/qg-column-filter` (Spartan `hlm*` popover UI)                         |
| `full` (L3)      | `filter-editors/` + `grid-shell/hlm-query-grid` (+ views, column chooser, pagination) |

Default output: `src/app/shared/query-grid/`.

- **L1** — use `<qg-spartan-data-grid>` from npm only (built-in `qg-sh-*` helm).
- **L2** — `filter-editors` level for custom column filter UI.
- **L3** — `full` level; local `<qg-hlm-query-grid>` with Spartan `hlm*` ([spartan-l3-hlm.md](https://github.com/laczynski/QueryGrid/blob/main/docs/guides/spartan-l3-hlm.md)).

Grid state and `GridQuery` stay in `@query-grid/spartan`.

See [spartan-ui-alignment.md](https://github.com/laczynski/QueryGrid/blob/main/docs/guides/spartan-ui-alignment.md).
