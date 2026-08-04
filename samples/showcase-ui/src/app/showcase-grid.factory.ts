import { Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import type { GridExportColumnInput, GridQuery, GridViewPreset } from '@query-grid/core';
import { createGridResource, type GridResource } from '@query-grid/primeng';
import {
  createGridResource as createUiGridResource,
  type GridResource as UiGridResource,
} from '@query-grid/ui';
import { ShowcaseRow } from './models/showcase-row.model';
import { ShowcaseApiService } from './services/showcase-api.service';

function showcaseExportColumns(translate: TranslateService): readonly GridExportColumnInput[] {
  return [
    { field: 'Id', header: translate.instant('showcase.columns.id') },
    { field: 'Label', header: translate.instant('showcase.columns.label') },
    { field: 'OptionalNote', header: translate.instant('showcase.columns.optionalNote') },
    { field: 'Quantity', header: translate.instant('showcase.columns.quantity') },
    { field: 'BigNumber', header: translate.instant('showcase.columns.bigNumber') },
    { field: 'Price', header: translate.instant('showcase.columns.price') },
    { field: 'Score', header: translate.instant('showcase.columns.score') },
    { field: 'IsActive', header: translate.instant('showcase.columns.isActive') },
    { field: 'OccurredAt', header: translate.instant('showcase.columns.occurredAt') },
    { field: 'OccurredAtOffset', header: translate.instant('showcase.columns.occurredAtOffset') },
    { field: 'OccurredOn', header: translate.instant('showcase.columns.occurredOn') },
    { field: 'Category', header: translate.instant('showcase.columns.category') },
    { field: 'ReferenceId', header: translate.instant('showcase.columns.referenceId') },
    { field: 'SortDisabledField', header: translate.instant('showcase.columns.sortDisabledField') },
    {
      field: 'FilterDisabledField',
      header: translate.instant('showcase.columns.filterDisabledField'),
    },
    { field: 'NullableDate', header: translate.instant('showcase.columns.nullableDate') },
  ];
}

function showcaseGridOptions(injector: Injector, api: ShowcaseApiService, persistKey: string) {
  const translate = injector.get(TranslateService);
  const showcaseActiveView: GridViewPreset = {
    id: 'showcase-active',
    name: translate.instant('showcase.views.activeOnly'),
    builtin: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    query: {
      filter: { field: 'IsActive', operator: 'eq', value: true },
    },
  };

  return {
    injector,
    load: (query: GridQuery) => api.getRows(query),
    defaultSort: [{ field: 'Id', desc: false }],
    defaultTake: 20,
    persistState: { key: persistKey, storage: 'session' as const },
    syncRoute: true,
    columnChooser: true,
    columnLayout: true,
    rowSelection: true,
    export: {
      url: '/rows/export',
      dataKeyField: 'id',
      defaultFilename: 'showcase-rows',
      columns: [],
      resolveColumns: () => showcaseExportColumns(translate),
    },
    views: {
      storageKey: persistKey,
      builtins: [showcaseActiveView],
    },
  };
}

export function createPrimengShowcaseGrid(
  injector: Injector,
  api: ShowcaseApiService,
): GridResource<ShowcaseRow> {
  return createGridResource(showcaseGridOptions(injector, api, 'querygrid.showcase-primeng'));
}

export function createUiShowcaseGrid(
  injector: Injector,
  api: ShowcaseApiService,
): UiGridResource<ShowcaseRow> {
  return createUiGridResource(showcaseGridOptions(injector, api, 'querygrid.showcase-ui'));
}
