import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";
import type { HelmIconName, HelmSize } from "./types";

const ICON_PATHS: Record<string, string> = {
  filter: "M3 4h18l-7 8v6l-4 2v-8L3 4z",
  filter_add: "M3 4h18l-7 8v6l-4 2v-8L3 4z M19 3v4 M21 5h-4",
  filter_dismiss: "M3 4h18l-7 8v6l-4 2v-8L3 4z M18 6l-12 12 M6 6l12 12",
  column: "M4 6h16M4 12h10M4 18h6",
  arrow_download: "M12 3v12m0 0l4-4m-4 4l-4-4M4 21h16",
  dismiss: "M6 6l12 12M18 6L6 18",
  delete: "M4 7h16M9 7V5h6v2m-7 4v6m4-6v6m4-6v6M7 7l1 12h8l1-12",
  add: "M12 5v14M5 12h14",
  save: "M5 5h14v14H5z M9 5v4h6V5",
  pin: "M12 17v5M8 3h8l-1 7h-6L8 3z",
  arrow_left: "M15 18l-6-6 6-6",
  arrow_right: "M9 18l6-6-6-6",
  arrow_sort: "M8 9l4-4 4 4M8 15l4 4 4-4",
  arrow_sort_up_lines: "M8 14l4-4 4 4",
  arrow_sort_down_lines: "M8 10l4 4 4-4",
  re_order_dots_vertical: "M9 6h6M9 12h6M9 18h6",
  table: "M4 6h16v12H4z M4 10h16 M10 6v12",
  document_csv: "M6 4h9l5 5v11H6z M15 4v5h5",
};

@Component({
  selector: "dg-sh-icon",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      [attr.width]="dimension()"
      [attr.height]="dimension()"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path [attr.d]="path()" />
    </svg>
  `,
  host: {
    class: "inline-flex shrink-0",
  },
})
export class IconComponent {
  readonly icon = input.required<HelmIconName>();
  readonly size = input<HelmSize>("medium");
  readonly variant = input<"regular" | "filled">("regular");

  protected readonly dimension = computed(() => {
    switch (this.size()) {
      case "small":
        return 14;
      case "large":
        return 20;
      default:
        return 16;
    }
  });

  protected readonly path = computed(
    () => ICON_PATHS[this.icon()] ?? "M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0",
  );
}
