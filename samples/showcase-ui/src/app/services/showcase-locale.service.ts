import { computed, inject, Injectable, signal } from '@angular/core';
import { UiI18nService } from '@laczynski/ui';
import { TranslateService } from '@ngx-translate/core';
import { DgI18nService as DgPrimengI18nService } from '@laczynski/datagrid-primeng';
import { DgI18nService as DgUiI18nService } from '@laczynski/datagrid-ui';
import { en } from 'primelocale/js/en.js';
import { pl } from 'primelocale/js/pl.js';
import { PrimeNG } from 'primeng/config';
import { firstValueFrom } from 'rxjs';

export type ShowcaseLanguage = 'pl' | 'en';

const STORAGE_KEY = 'querygrid.showcase.lang';

@Injectable({ providedIn: 'root' })
export class ShowcaseLocaleService {
  private readonly translate = inject(TranslateService);
  private readonly primeNG = inject(PrimeNG);
  private readonly dgUiI18n = inject(DgUiI18nService);
  private readonly dgPrimengI18n = inject(DgPrimengI18nService);
  private readonly uiI18n = inject(UiI18nService);

  readonly language = signal<ShowcaseLanguage>('pl');
  readonly angularLocale = computed(() => (this.language() === 'pl' ? 'pl-PL' : 'en-US'));

  async init(): Promise<void> {
    const stored = globalThis.localStorage?.getItem(STORAGE_KEY);
    const lang: ShowcaseLanguage = stored === 'en' || stored === 'pl' ? stored : 'pl';
    await this.setLanguage(lang);
  }

  async setLanguage(lang: ShowcaseLanguage): Promise<void> {
    await firstValueFrom(this.translate.use(lang));
    this.language.set(lang);
    globalThis.localStorage?.setItem(STORAGE_KEY, lang);
    this.primeNG.setTranslation(lang === 'pl' ? pl : en);
    document.documentElement.lang = lang;
    this.dgUiI18n.notifyLanguageChanged();
    this.dgPrimengI18n.notifyLanguageChanged();
    this.uiI18n.notifyLanguageChanged();
  }
}
