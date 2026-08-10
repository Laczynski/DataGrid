import { ChangeDetectionStrategy, Component, computed, inject, input, output } from "@angular/core";
import { DgI18nService } from "../i18n";
import { buildPageTokens } from "./pagination.util";
import type { HelmSize, PaginationConfig } from "./types";

@Component({
  selector: "dg-sh-pagination",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="dg-sh-pagination" [attr.aria-label]="ariaLabel()">
      @if (config().showInfo) {
        <div class="dg-sh-pagination__info">{{ rangeLabel() }}</div>
      }

      <div class="dg-sh-pagination__controls">
        @if (config().showFirstLast) {
          <button
            type="button"
            class="dg-sh-pagination__btn"
            [disabled]="isFirstPage()"
            (click)="goToPage(1)"
            [attr.aria-label]="firstPageLabel()"
          >
            «
          </button>
        }

        <button
          type="button"
          class="dg-sh-pagination__btn"
          [disabled]="isFirstPage()"
          (click)="goToPage(config().currentPage - 1)"
          [attr.aria-label]="previousPageLabel()"
        >
          ‹
        </button>

        @if (config().showPageNumbers) {
          @for (token of pageTokens(); track token) {
            @if (token === "ellipsis") {
              <span class="dg-sh-pagination__ellipsis" aria-hidden="true">…</span>
            } @else {
              <button
                type="button"
                class="dg-sh-pagination__btn"
                [class.dg-sh-pagination__btn--active]="token === config().currentPage"
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
          type="button"
          class="dg-sh-pagination__btn"
          [disabled]="isLastPage()"
          (click)="goToPage(config().currentPage + 1)"
          [attr.aria-label]="nextPageLabel()"
        >
          ›
        </button>

        @if (config().showFirstLast) {
          <button
            type="button"
            class="dg-sh-pagination__btn"
            [disabled]="isLastPage()"
            (click)="goToPage(config().totalPages)"
            [attr.aria-label]="lastPageLabel()"
          >
            »
          </button>
        }
      </div>

      @if (config().showPageSizeSelector) {
        <label class="dg-sh-pagination__size">
          <span class="dg-sh-pagination__size-label">{{ rowsPerPageLabel() }}</span>
          <select
            class="dg-sh-pagination__size-select"
            [value]="config().pageSize"
            (change)="onPageSizeChange($event)"
          >
            @for (option of pageSizeOptions(); track option) {
              <option [value]="option">{{ option }}</option>
            }
          </select>
        </label>
      }
    </nav>
  `,
  styleUrl: "./pagination.component.scss",
})
export class PaginationComponent {
  private readonly i18n = inject(DgI18nService);

  readonly config = input.required<PaginationConfig>();
  readonly size = input<HelmSize>("medium");

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
    () => this.config().pageSizeOptions ?? [10, 20, 50],
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

  protected onPageSizeChange(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    if (!Number.isNaN(value) && value > 0) {
      this.pageSizeChange.emit(value);
    }
  }
}
