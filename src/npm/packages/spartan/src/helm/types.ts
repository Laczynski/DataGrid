export type HelmSize = "small" | "medium" | "large";

export type HelmIconName = string;

export interface SelectItem {
  label: string;
  value: unknown;
  disabled?: boolean;
}

export interface MenuItem {
  id: string;
  label: string;
  icon?: HelmIconName;
  disabled?: boolean;
}

export interface PaginationConfig {
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
}
