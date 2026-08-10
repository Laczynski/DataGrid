import { ChangeDetectionStrategy, Component, computed, inject, input, output } from "@angular/core";
import type { GridSize } from "@laczynski/datagrid-spartan";
import { DgI18nService } from "@laczynski/datagrid-spartan";
import { DG_GRID_HELM_IMPORTS } from "./dg-helm-utils";
import { buildPageTokens } from "./dg-pagination.util";

export type DgGridPaginationConfig = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  showPageSizeSelector?: boolean;
  pageSizeOptions?: number[];
  showPageNumbers?: boolean;
  maxVisiblePages?: number;
  showFirstLast?: boolean;
  showInfo?: boolean;
};

@Component({
  selector: "dg-grid-pagination",
  standalone: true,
  imports: [...DG_GRID_HELM_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="flex flex-wrap items-center justify-between gap-3" [attr.aria-label]="ariaLabel()">
      @if (config().showInfo) {
        <div class="text-muted-foreground text-sm">{{ rangeLabel() }}</div>
      }

      <div class="flex flex-wrap items-center gap-1">
        @if (config().showFirstLast) {
          <button
            hlmBtn
            variant="outline"
            [size]="btnSize()"
            type="button"
            [disabled]="isFirstPage()"
            (click)="goToPage(1)"
            [attr.aria-label]="firstPageLabel()"
          >
            «
          </button>
        }

        <button
          hlmBtn
          variant="outline"
          [size]="btnSize()"
          type="button"
          [disabled]="isFirstPage()"
          (click)="goToPage(config().currentPage - 1)"
          [attr.aria-label]="previousPageLabel()"
        >
          ‹
        </button>

        @if (config().showPageNumbers) {
          @for (token of pageTokens(); track token) {
            @if (token === "ellipsis") {
              <span class="text-muted-foreground px-1" aria-hidden="true">…</span>
            } @else {
              <button
                hlmBtn
                [variant]="token === config().currentPage ? 'default' : 'outline'"
                [size]="btnSize()"
                type="button"
                [attr.aria-current]="token === config().currentPage ? 'page' : null"
                [attr.aria-label]="pageLabel(token)"
                (click)="goToPage(token)"
              >
                {{ token }}
              </button>
            }
          }
        }

        <button
          hlmBtn
          variant="outline"
          [size]="btnSize()"
          type="button"
          [disabled]="isLastPage()"
          (click)="goToPage(config().currentPage + 1)"
          [attr.aria-label]="nextPageLabel()"
        >
          ›
        </button>

        @if (config().showFirstLast) {
          <button
            hlmBtn
            variant="outline"
            [size]="btnSize()"
            type="button"
            [disabled]="isLastPage()"
            (click)="goToPage(config().totalPages)"
            [attr.aria-label]="lastPageLabel()"
          >
            »
          </button>
        }
      </div>

      @if (config().showPageSizeSelector) {
        <label class="text-muted-foreground flex items-center gap-2 text-sm">
          <span>{{ rowsPerPageLabel() }}</span>
          <hlm-select
            [value]="pageSizeValue()"
            [itemToString]="pageSizeItemToString"
            (valueChange)="onPageSizeSelected($event)"
          >
            <hlm-select-trigger size="sm" class="h-8 w-20">
              <hlm-select-value />
            </hlm-select-trigger>
            <hlm-select-content *hlmSelectPortal>
              @for (option of pageSizeOptions(); track option) {
                <hlm-select-item [value]="formatPageSizeOption(option)">{{
                  option
                }}</hlm-select-item>
              }
            </hlm-select-content>
          </hlm-select>
        </label>
      }
    </nav>
  `,
})
export class DgGridPaginationComponent {
  private readonly i18n = inject(DgI18nService);

  readonly config = input.required<DgGridPaginationConfig>();
  readonly size = input<GridSize>("medium");

  readonly pageChange = output<number>();
  readonly pageSizeChange = output<number>();

  protected readonly pageTokens = computed(() =>
    buildPageTokens(
      this.config().currentPage,
      this.config().totalPages,
      this.config().maxVisiblePages ?? 5,
    ),
  );

  protected readonly rangeLabel = computed(() => {
    this.i18n.languageVersion()();
    const { currentPage, pageSize, totalItems } = this.config();
    if (totalItems === 0) {
      return this.i18n.t("pagination.empty", "0");
    }

    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalItems);
    return this.i18n.t("pagination.range", `${start}–${end} of ${totalItems}`, {
      start,
      end,
      total: totalItems,
    });
  });

  protected readonly pageSizeOptions = computed(
    () => this.config().pageSizeOptions ?? [10, 20, 50, 100],
  );

  protected readonly ariaLabel = this.i18n.tSignal("pagination.ariaLabel", "Pagination");
  protected readonly firstPageLabel = this.i18n.tSignal("pagination.firstPage", "First page");
  protected readonly previousPageLabel = this.i18n.tSignal(
    "pagination.previousPage",
    "Previous page",
  );
  protected readonly nextPageLabel = this.i18n.tSignal("pagination.nextPage", "Next page");
  protected readonly lastPageLabel = this.i18n.tSignal("pagination.lastPage", "Last page");
  protected readonly rowsPerPageLabel = this.i18n.tSignal("pagination.rowsPerPage", "Rows");

  protected btnSize(): "sm" | "default" | "lg" {
    switch (this.size()) {
      case "small":
        return "sm";
      case "large":
        return "lg";
      default:
        return "default";
    }
  }

  protected pageLabel(page: number): string {
    this.i18n.languageVersion()();
    return this.i18n.t("pagination.page", `Page ${page}`, { page });
  }

  protected isFirstPage(): boolean {
    return this.config().currentPage <= 1;
  }

  protected isLastPage(): boolean {
    return this.config().currentPage >= this.config().totalPages;
  }

  protected goToPage(page: number): void {
    const clamped = Math.min(Math.max(page, 1), this.config().totalPages);
    if (clamped !== this.config().currentPage) {
      this.pageChange.emit(clamped);
    }
  }

  protected readonly pageSizeValue = computed(() => `${this.config().pageSize}`);

  protected formatPageSizeOption(option: number): string {
    return `${option}`;
  }

  protected readonly pageSizeItemToString = (value: string | null | undefined): string =>
    value ?? "";

  protected onPageSizeSelected(value: string | null | undefined): void {
    const parsed = Number(value);
    if (!Number.isNaN(parsed) && parsed > 0) {
      this.pageSizeChange.emit(parsed);
    }
  }
}
