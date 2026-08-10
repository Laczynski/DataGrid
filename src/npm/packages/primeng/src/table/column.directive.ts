import { Directive, inject, input, TemplateRef } from "@angular/core";
import type { DgColumnContext } from "./column-context";
import type { GridCellAlign, GridColumn, GridColumnFilter } from "./grid-column";

/**
 * Declares a grid column and its cell template in one place.
 *
 * ```html
 * <ng-template
 *   dgColumn="status"
 *   header="Status"
 *   [filter]="{ type: 'enum', options: statusOptions }"
 *   [dgColumnOf]="rowType"
 *   let-row
 * >
 *   <p-tag [value]="row.status" />
 * </ng-template>
 * ```
 *
 * When the host grid has no `[columns]` input, column metadata is derived from
 * projected `dgColumn` templates in DOM order.
 */
@Directive({ selector: "[dgColumn]", standalone: true })
export class DgColumnDirective<T = unknown> {
  /** Server field name; must match a sortable/filterable DTO property. */
  readonly field = input.required<string>({ alias: "dgColumn" });
  /**
   * Type-only anchor for `let-row` (e.g. `[dgColumnOf]="rowType"` where `rowType!: MyRow`).
   * Not used at runtime.
   */
  readonly rowTypeAnchor = input<T | undefined>(undefined, {
    alias: "dgColumnOf",
  });
  /** Header label shown in the table. */
  readonly header = input.required<string>();
  /** Defaults to `true`. Set `false` for computed/non-server columns. */
  readonly sortable = input<boolean | undefined>(undefined);
  /** Defaults to `true`. Set `false` to exclude the column from the column chooser. */
  readonly hideable = input<boolean | undefined>(undefined);
  readonly reorderable = input<boolean | undefined>(undefined);
  readonly resizable = input<boolean | undefined>(undefined);
  readonly pinnable = input<boolean | undefined>(undefined);
  readonly pin = input<"left" | "right" | undefined>(undefined);
  readonly minWidth = input<number | undefined>(undefined);
  /** Column header filter editor. Omit to disable filtering. */
  readonly filter = input<GridColumnFilter | undefined>(undefined);
  readonly align = input<GridCellAlign | undefined>(undefined);
  readonly width = input<string | undefined>(undefined);
  readonly template = inject<TemplateRef<DgColumnContext<T>>>(TemplateRef);

  toGridColumn(): GridColumn<T> {
    const column: GridColumn<T> = {
      field: this.field(),
      header: this.header(),
    };

    const sortable = this.sortable();
    if (sortable !== undefined) {
      column.sortable = sortable;
    }

    const hideable = this.hideable();
    if (hideable !== undefined) {
      column.hideable = hideable;
    }

    const reorderable = this.reorderable();
    if (reorderable !== undefined) {
      column.reorderable = reorderable;
    }

    const resizable = this.resizable();
    if (resizable !== undefined) {
      column.resizable = resizable;
    }

    const pinnable = this.pinnable();
    if (pinnable !== undefined) {
      column.pinnable = pinnable;
    }

    const pin = this.pin();
    if (pin) {
      column.pin = pin;
    }

    const minWidth = this.minWidth();
    if (minWidth !== undefined) {
      column.minWidth = minWidth;
    }

    const filter = this.filter();
    if (filter) {
      column.filter = filter;
    }

    const align = this.align();
    if (align) {
      column.align = align;
    }

    const width = this.width();
    if (width) {
      column.width = width;
    }

    return column;
  }

  static ngTemplateContextGuard<T>(
    _directive: DgColumnDirective<T>,
    _context: unknown,
  ): _context is DgColumnContext<T> {
    return true;
  }
}
