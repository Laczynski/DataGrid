import { CommonModule } from '@angular/common';
import { Component, computed, inject, Injector, signal } from '@angular/core';
import { CardComponent, MessageBarComponent, TagComponent } from '@laczynski/lui';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { buildGridQueryUrl, formatGridError } from '@laczynski/datagrid';
import { DgColumnDirective, DgEmptyDirective, UiDataGridComponent } from '@laczynski/datagrid-ui';
import { ShowcaseRow } from './models/showcase-row.model';
import { ShowcaseApiService } from './services/showcase-api.service';
import { ShowcaseLocaleService } from './services/showcase-locale.service';
import { createUiShowcaseGrid } from './showcase-grid.factory';
import { getShowcaseCategoryLabel, showcaseCategories } from './utils/showcase.utils';

@Component({
  selector: 'app-ui-showcase-page',
  imports: [
    CommonModule,
    CardComponent,
    MessageBarComponent,
    TagComponent,
    UiDataGridComponent,
    DgColumnDirective,
    DgEmptyDirective,
    TranslatePipe,
  ],
  templateUrl: './ui-showcase-page.component.html',
  styleUrl: './showcase-page.shared.css',
})
export class UiShowcasePageComponent {
  private readonly api = inject(ShowcaseApiService);
  private readonly injector = inject(Injector);
  private readonly translate = inject(TranslateService);
  protected readonly locale = inject(ShowcaseLocaleService);

  readonly showcaseCategories = () => {
    this.locale.language();
    return showcaseCategories(this.translate);
  };
  readonly getShowcaseCategoryLabel = (category: ShowcaseRow['category']) => {
    this.locale.language();
    return getShowcaseCategoryLabel(category, this.translate);
  };

  readonly grid = createUiShowcaseGrid(this.injector, this.api);

  protected readonly rowType!: ShowcaseRow;

  readonly errorMessage = computed(() => formatGridError(this.grid.error()));

  readonly exportError = signal<string | null>(null);

  readonly linkCopied = signal(false);

  copyGridLink(): void {
    const url = buildGridQueryUrl(globalThis.location.href, this.grid.query());
    void navigator.clipboard.writeText(url).then(() => {
      this.linkCopied.set(true);
      globalThis.setTimeout(() => this.linkCopied.set(false), 2000);
    });
  }

  onExportError(message: string): void {
    this.exportError.set(message);
  }
}
