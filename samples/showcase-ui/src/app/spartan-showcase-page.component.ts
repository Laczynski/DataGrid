import { CommonModule } from '@angular/common';
import { Component, computed, inject, Injector, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { formatGridError } from '@query-grid/core';
import { QgColumnDirective, QgEmptyDirective } from '@query-grid/spartan';
import { ShowcaseRow } from './models/showcase-row.model';
import { ShowcaseApiService } from './services/showcase-api.service';
import { ShowcaseLocaleService } from './services/showcase-locale.service';
import { HlmQueryGridComponent } from './shared/query-grid/grid-shell/hlm-query-grid.component';
import { createSpartanShowcaseGrid } from './showcase-grid.factory';
import { getShowcaseCategoryLabel, showcaseCategories } from './utils/showcase.utils';

@Component({
  selector: 'app-spartan-showcase-page',
  imports: [
    CommonModule,
    HlmQueryGridComponent,
    QgColumnDirective,
    QgEmptyDirective,
    TranslatePipe,
  ],
  templateUrl: './spartan-showcase-page.component.html',
  styleUrl: './showcase-page.shared.css',
})
export class SpartanShowcasePageComponent {
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

  readonly grid = createSpartanShowcaseGrid(this.injector, this.api);

  protected readonly rowType!: ShowcaseRow;

  readonly errorMessage = computed(() => formatGridError(this.grid.error()));

  readonly exportError = signal<string | null>(null);

  onExportError(message: string): void {
    this.exportError.set(message);
  }
}
