# @laczynski/datagrid-ui

@laczynski/lui adapter for [DataGrid](https://github.com/laczynski/DataGrid): `<dg-ui-data-grid>` with column filters (multi-rule, Match All / Match Any), global search, removable filter chips, multi-sort, pagination, and optional state persistence.

## Install

```powershell
npm install @laczynski/datagrid @laczynski/datagrid-ui @laczynski/lui
```

Peer dependencies: Angular 22.1+, `@laczynski/lui` 2.0.0-preview.6+, `@angular/cdk` 22.1+, RxJS 7+.

## Usage

Create a grid store with `createGridResource` (or inject `GridResourceFactory`), then bind it to `<dg-ui-data-grid>` and declare columns with `dgColumn` templates. The `dgColumn` / `dgEmpty` API mirrors `@laczynski/datagrid-primeng`.

## Full guide

[Getting started](https://github.com/laczynski/DataGrid/blob/main/docs/getting-started.md)
