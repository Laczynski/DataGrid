import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Button } from "primeng/button";
import { Dialog } from "primeng/dialog";
import { InputText } from "primeng/inputtext";
import { Select } from "primeng/select";
import { Tooltip } from "primeng/tooltip";
import type { GridResource } from "./create-grid-resource";
import { hasGridViews, type GridResourceWithViews } from "./grid-views-controls";
import { DgI18nService } from "./i18n";

function asGridWithViews<T>(
  grid: GridResource<T>,
): (GridResource<T> & GridResourceWithViews) | null {
  return hasGridViews(grid) ? grid : null;
}

@Component({
  selector: "dg-grid-views",
  standalone: true,
  imports: [CommonModule, FormsModule, Select, Button, Dialog, InputText, Tooltip],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./grid-views.component.html",
  styles: `
    :host {
      display: contents;
    }

    .dg-grid-views-group {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .dg-grid-views {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .dg-grid-views__divider {
      width: 1px;
      align-self: stretch;
      min-height: 1.5rem;
      margin-inline: 0.125rem;
      background: var(--p-content-border-color, #e2e8f0);
    }

    .dg-grid-views__select {
      min-width: 12rem;
    }

    .dg-grid-views__save-field {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      width: 100%;
    }

    .dg-grid-views__dialog-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      width: 100%;
    }
  `,
})
export class DgGridViewsComponent<T = unknown> {
  private readonly i18n = inject(DgI18nService);

  readonly grid = input.required<GridResource<T>>();

  protected readonly showSaveDialog = signal(false);
  protected readonly newPresetName = signal("");

  protected readonly viewsEnabled = computed(() => asGridWithViews(this.grid()) != null);

  protected readonly viewsPlaceholder = this.i18n.tSignal("views.placeholder", "Views");
  protected readonly updateViewLabel = this.i18n.tSignal("views.update", "Update view");
  protected readonly saveAsViewLabel = this.i18n.tSignal("views.saveAs", "Save as view");
  protected readonly deleteViewLabel = this.i18n.tSignal("views.delete", "Delete view");
  protected readonly saveViewTitle = this.i18n.tSignal("views.saveTitle", "Save view");
  protected readonly viewNamePlaceholder = this.i18n.tSignal("views.namePlaceholder", "View name");
  protected readonly cancelLabel = this.i18n.tSignal("views.cancel", "Cancel");
  protected readonly saveLabel = this.i18n.tSignal("views.save", "Save");

  protected readonly presetOptions = computed(() => {
    const grid = asGridWithViews(this.grid());
    if (!grid) {
      return [];
    }

    return grid.presets().map((preset) => ({
      label: preset.name,
      value: preset.id,
    }));
  });

  protected readonly selectedPresetId = computed(
    () => asGridWithViews(this.grid())?.activePresetId() ?? null,
  );

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

  protected onPresetSelected(id: string | null): void {
    const grid = asGridWithViews(this.grid());
    if (!grid) {
      return;
    }

    if (!id) {
      grid.clearActivePreset();
      return;
    }

    grid.applyPreset(id);
  }

  protected openSaveDialog(): void {
    this.newPresetName.set("");
    this.showSaveDialog.set(true);
  }

  protected closeSaveDialog(): void {
    this.showSaveDialog.set(false);
    this.newPresetName.set("");
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
