import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideSearch } from "@ng-icons/lucide";
import type { GridSize } from "@laczynski/datagrid-spartan";
import { BrnSelectImports } from "@spartan-ng/brain/select";
import { HlmButtonImports } from "@spartan-ng/helm/button";
import { HlmCheckboxImports } from "@spartan-ng/helm/checkbox";
import { HlmDropdownMenuImports } from "@spartan-ng/helm/dropdown-menu";
import { HlmInput } from "@spartan-ng/helm/input";
import { HlmPopoverImports } from "@spartan-ng/helm/popover";
import { HlmSelectImports } from "@spartan-ng/helm/select";
import { HlmSpinnerImports } from "@spartan-ng/helm/spinner";
import { HlmTooltipImports } from "@spartan-ng/helm/tooltip";
import { DG_GRID_LUCIDE_ICONS } from "./dg-icon-map";

export const DG_SELECT_EMPTY_VALUE = "__dg_select_none__";

export const DG_GRID_HELM_IMPORTS = [
  NgIcon,
  ...HlmButtonImports,
  ...HlmCheckboxImports,
  ...HlmDropdownMenuImports,
  ...HlmPopoverImports,
  ...HlmSpinnerImports,
  ...BrnSelectImports,
  ...HlmSelectImports,
  ...HlmTooltipImports,
  HlmInput,
] as const;

export function provideDgGridHelmIcons() {
  return provideIcons({ ...DG_GRID_LUCIDE_ICONS, lucideSearch });
}

export function dgBtnSize(size: GridSize): "sm" | "default" | "lg" {
  switch (size) {
    case "small":
      return "sm";
    case "large":
      return "lg";
    default:
      return "default";
  }
}

export function dgIconBtnSize(size: GridSize): "icon-sm" | "icon" | "icon-lg" {
  switch (size) {
    case "small":
      return "icon-sm";
    case "large":
      return "icon-lg";
    default:
      return "icon";
  }
}

export function qgSelectTriggerClass(size: GridSize, extra = ""): string {
  const width = extra.trim() || "w-full min-w-0";
  if (size === "small") {
    return `${width} h-8`;
  }
  if (size === "large") {
    return `${width} h-10`;
  }
  return width;
}

export function qgFieldClass(size: GridSize): string {
  const base =
    "border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full min-w-0 rounded-md border bg-transparent px-2.5 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50";
  if (size === "small") {
    return `${base} h-8 text-xs`;
  }
  if (size === "large") {
    return `${base} h-10 text-base`;
  }
  return base;
}

export function isDgSelectEmptyValue(value: unknown): boolean {
  return value === null || value === undefined || value === "" || value === DG_SELECT_EMPTY_VALUE;
}

export function qgSelectItemValue(value: unknown): string {
  if (isDgSelectEmptyValue(value)) {
    return DG_SELECT_EMPTY_VALUE;
  }

  const normalized = String(value);
  return normalized.length > 0 ? normalized : DG_SELECT_EMPTY_VALUE;
}

export function qgSelectItemToString(
  items: readonly { label: string; value: string }[],
): (value: string | null | undefined) => string {
  const labels = new Map(items.map((item) => [item.value, item.label]));
  return (value) => {
    if (isDgSelectEmptyValue(value)) {
      return "";
    }
    return labels.get(String(value)) ?? String(value);
  };
}
