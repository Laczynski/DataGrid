import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, inject, input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { isColumnHideable } from "@query-grid/core";
import type { GridResource } from "@query-grid/spartan";
import { hasColumnLayout } from "@query-grid/spartan";
import {
  hasColumnChooser,
  type GridResourceWithColumnChooser,
} from "@query-grid/spartan";
import { QgI18nService } from "@query-grid/spartan";
import type { GridColumn } from "@query-grid/spartan";
import type { GridSize } from "@query-grid/spartan";
import {
  QG_GRID_HELM_IMPORTS,
  provideQgGridHelmIcons,
  qgBtnSize,
  qgIconBtnSize,
} from "./qg-helm-utils";
import { resolveQgGridIcon } from "./qg-icon-map";

function asGridWithColumnChooser<T>(
  grid: GridResource<T>,
): (GridResource<T> & GridResourceWithColumnChooser) | null {
  return hasColumnChooser(grid) ? grid : null;
}

@Component({
  selector: "qg-grid-column-chooser",
  standalone: true,
  imports: [CommonModule, FormsModule, ...QG_GRID_HELM_IMPORTS],
  providers: [provideQgGridHelmIcons()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./grid-column-chooser.component.html",
  styleUrl: "./grid-column-chooser.component.scss",
})
export class QgGridColumnChooserComponent<T = unknown> {
  private readonly i18n = inject(QgI18nService);

  readonly grid = input.required<GridResource<T>>();
  readonly columns = input.required<GridColumn<T>[]>();
  readonly size = input<GridSize>("medium");

  protected readonly resolveQgGridIcon = resolveQgGridIcon;
  protected readonly qgBtnSize = qgBtnSize;
  protected readonly qgIconBtnSize = qgIconBtnSize;

  protected readonly layoutEnabled = computed(() => hasColumnLayout(this.grid()));

  protected readonly chooserEnabled = computed(
    () => asGridWithColumnChooser(this.grid()) != null || this.layoutEnabled(),
  );

  protected readonly hasLayoutChanges = computed(() => {
    const grid = this.grid();
    if (!hasColumnLayout(grid)) {
      return false;
    }

    return Object.keys(grid.columnWidths()).length > 0 || Object.keys(grid.columnPins()).length > 0;
  });

  protected readonly hideableColumns = computed(() =>
    this.columns().filter((column) => isColumnHideable(column)),
  );

  protected readonly hiddenFields = computed(() => {
    const grid = asGridWithColumnChooser(this.grid());
    return new Set(grid?.hiddenColumnFields() ?? []);
  });

  protected readonly hasHiddenColumns = computed(() => this.hiddenFields().size > 0);

  protected readonly columnsLabel = this.i18n.tSignal("columnChooser.columns", "Columns");
  protected readonly showAllLabel = this.i18n.tSignal("columnChooser.showAll", "Show all");
  protected readonly resetLayoutLabel = this.i18n.tSignal(
    "columnChooser.resetLayout",
    "Reset layout",
  );

  protected isColumnVisible(field: string): boolean {
    return !this.hiddenFields().has(field);
  }

  protected canUncheck(field: string): boolean {
    const hidden = this.hiddenFields();
    const visibleCount = this.hideableColumns().filter(
      (column) => !hidden.has(column.field),
    ).length;
    return !this.isColumnVisible(field) || visibleCount > 1;
  }

  protected onVisibilityChange(field: string, visible: boolean): void {
    asGridWithColumnChooser(this.grid())?.setColumnVisible(field, visible);
  }

  protected showAllColumns(): void {
    asGridWithColumnChooser(this.grid())?.showAllColumns();
  }

  protected resetColumnLayout(): void {
    const grid = this.grid();
    if (hasColumnLayout(grid)) {
      grid.resetColumnLayout();
    }
  }
}
