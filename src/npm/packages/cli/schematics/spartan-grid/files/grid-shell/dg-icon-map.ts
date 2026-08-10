import {
  lucideArrowDown,
  lucideArrowUp,
  lucideArrowUpDown,
  lucideChevronLeft,
  lucideChevronRight,
  lucideColumns3,
  lucideDownload,
  lucideFileSpreadsheet,
  lucideFilter,
  lucideFilterX,
  lucideGripVertical,
  lucideListFilter,
  lucidePin,
  lucidePlus,
  lucideSave,
  lucideTable,
  lucideTrash2,
  lucideX,
} from "@ng-icons/lucide";

export const DG_GRID_LUCIDE_ICONS = {
  lucideFilter,
  lucideListFilter,
  lucideFilterX,
  lucideColumns3,
  lucideDownload,
  lucideX,
  lucideTrash2,
  lucidePlus,
  lucideSave,
  lucidePin,
  lucideChevronLeft,
  lucideChevronRight,
  lucideArrowUpDown,
  lucideArrowUp,
  lucideArrowDown,
  lucideGripVertical,
  lucideTable,
  lucideFileSpreadsheet,
};

const ICON_ALIASES: Record<string, keyof typeof DG_GRID_LUCIDE_ICONS> = {
  filter: "lucideFilter",
  filter_add: "lucideListFilter",
  filter_dismiss: "lucideFilterX",
  column: "lucideColumns3",
  arrow_download: "lucideDownload",
  dismiss: "lucideX",
  delete: "lucideTrash2",
  add: "lucidePlus",
  save: "lucideSave",
  pin: "lucidePin",
  arrow_left: "lucideChevronLeft",
  arrow_right: "lucideChevronRight",
  arrow_sort: "lucideArrowUpDown",
  arrow_sort_up_lines: "lucideArrowUp",
  arrow_sort_down_lines: "lucideArrowDown",
  re_order_dots_vertical: "lucideGripVertical",
  table: "lucideTable",
  document_csv: "lucideFileSpreadsheet",
};

export function resolveDgGridIcon(name: string): keyof typeof DG_GRID_LUCIDE_ICONS {
  return ICON_ALIASES[name] ?? "lucideFilter";
}

export type DgGridMenuItem = {
  id: string;
  label: string;
  disabled?: boolean;
};

export type DgGridIconName = string;
