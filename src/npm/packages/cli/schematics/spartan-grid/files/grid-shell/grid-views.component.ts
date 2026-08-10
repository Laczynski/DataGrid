import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import type { GridResource, GridSize } from "@laczynski/datagrid-spartan";
import { hasGridViews, DgI18nService, type GridResourceWithViews } from "@laczynski/datagrid-spartan";
import {
  isDgSelectEmptyValue,
  provideDgGridHelmIcons,
  DG_GRID_HELM_IMPORTS,
  DG_SELECT_EMPTY_VALUE,
  dgBtnSize,
  qgFieldClass,
  dgIconBtnSize,
  qgSelectTriggerClass,
} from "./dg-helm-utils";
import { resolveDgGridIcon } from "./dg-icon-map";

function asGridWithViews<T>(
  grid: GridResource<T>,
): (GridResource<T> & GridResourceWithViews) | null {
  return hasGridViews(grid) ? grid : null;
}

@Component({
  selector: "dg-grid-views",
  standalone: true,
  imports: [CommonModule, FormsModule, ...DG_GRID_HELM_IMPORTS],
  providers: [provideDgGridHelmIcons()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./grid-views.component.html",
  styleUrl: "./grid-views.component.scss",
})
export class DgGridViewsComponent<T = unknown> {
  private readonly i18n = inject(DgI18nService);

  readonly grid = input.required<GridResource<T>>();
  readonly size = input<GridSize>("medium");

  private readonly saveDialog = viewChild<ElementRef<HTMLDialogElement>>("saveDialog");

  protected readonly newPresetName = signal("");

  protected readonly resolveDgGridIcon = resolveDgGridIcon;
  protected readonly dgBtnSize = dgBtnSize;
  protected readonly dgIconBtnSize = dgIconBtnSize;
  protected readonly qgFieldClass = qgFieldClass;
  protected readonly qgSelectTriggerClass = qgSelectTriggerClass;

  protected readonly viewsEnabled = computed(() => asGridWithViews(this.grid()) != null);

  protected readonly viewsPlaceholder = this.i18n.tSignal("views.placeholder", "Views");
  protected readonly updateViewLabel = this.i18n.tSignal("views.update", "Update view");
  protected readonly saveAsViewLabel = this.i18n.tSignal("views.saveAs", "Save as view");
  protected readonly deleteViewLabel = this.i18n.tSignal("views.delete", "Delete view");
  protected readonly saveViewTitle = this.i18n.tSignal("views.saveTitle", "Save view");
  protected readonly viewNamePlaceholder = this.i18n.tSignal("views.namePlaceholder", "View name");
  protected readonly cancelLabel = this.i18n.tSignal("views.cancel", "Cancel");
  protected readonly saveLabel = this.i18n.tSignal("views.save", "Save");

  protected readonly presetItems = computed(() => {
    const grid = asGridWithViews(this.grid());
    if (!grid) {
      return [];
    }

    return grid.presets().map((preset) => ({
      label: preset.name,
      value: preset.id,
    }));
  });

  protected readonly nonePresetValue = DG_SELECT_EMPTY_VALUE;

  protected readonly presetItemToString = (value: string | null | undefined): string => {
    if (isDgSelectEmptyValue(value)) {
      return this.viewsPlaceholder();
    }

    return this.presetItems().find((item) => item.value === value)?.label ?? String(value ?? "");
  };

  protected readonly selectedPresetId = computed(() => {
    const id = asGridWithViews(this.grid())?.activePresetId();
    return id ? id : DG_SELECT_EMPTY_VALUE;
  });

  protected readonly isPresetDirty = computed(
    () => asGridWithViews(this.grid())?.isPresetDirty() ?? false,
  );

  protected readonly canUpdateSelected = computed(() => {
    const grid = asGridWithViews(this.grid());
    if (!grid?.isPresetDirty()) {
      return false;
    }

    const id = grid.activePresetId();
    if (!id) {
      return false;
    }

    const preset = grid.presets().find((item) => item.id === id);
    return Boolean(preset && !preset.builtin);
  });

  protected readonly canDeleteSelected = computed(() => {
    const grid = asGridWithViews(this.grid());
    if (!grid) {
      return false;
    }

    const id = grid.activePresetId();
    if (!id) {
      return false;
    }

    const preset = grid.presets().find((item) => item.id === id);
    return Boolean(preset && !preset.builtin);
  });

  protected onPresetSelected(id: unknown): void {
    const presetId = isDgSelectEmptyValue(id) ? null : String(id);
    const grid = asGridWithViews(this.grid());
    if (!grid) {
      return;
    }

    if (!presetId) {
      grid.clearActivePreset();
      return;
    }

    grid.applyPreset(presetId);
  }

  protected openSaveDialog(): void {
    this.newPresetName.set("");
    this.saveDialog()?.nativeElement.showModal();
  }

  protected closeSaveDialog(): void {
    this.saveDialog()?.nativeElement.close();
    this.newPresetName.set("");
  }

  protected onSaveSubmit(event: Event): void {
    event.preventDefault();
    this.saveAs();
  }

  protected saveAs(): void {
    const name = this.newPresetName().trim();
    const grid = asGridWithViews(this.grid());
    if (!name || !grid) {
      return;
    }

    grid.saveCurrentAsPreset(name);
    this.closeSaveDialog();
  }

  protected updatePreset(): void {
    asGridWithViews(this.grid())?.updateActivePreset();
  }

  protected deleteSelected(): void {
    const grid = asGridWithViews(this.grid());
    const id = grid?.activePresetId();
    if (grid && id) {
      grid.deletePreset(id);
    }
  }
}
