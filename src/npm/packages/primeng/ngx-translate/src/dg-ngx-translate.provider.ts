import {
  ENVIRONMENT_INITIALIZER,
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  provideDgI18n,
  DG_I18N_CONFIG,
  DG_TRANSLATE_FN,
  DgI18nService,
  type DgI18nConfig,
} from "@laczynski/datagrid-primeng";

export function provideDgI18nWithNgxTranslate(
  config: Partial<DgI18nConfig> = {},
): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: DG_I18N_CONFIG,
      useValue: {
        enabled: true,
        prefix: "qg",
        ...config,
      } satisfies DgI18nConfig,
    },
    {
      provide: DG_TRANSLATE_FN,
      deps: [TranslateService],
      useFactory: (translate: TranslateService) => {
        return (key: string, params?: Record<string, unknown>) => {
          return translate.instant(key, params);
        };
      },
    },
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useValue: () => {
        const translate = inject(TranslateService);
        const qgI18n = inject(DgI18nService);
        translate.onLangChange.subscribe(() => qgI18n.notifyLanguageChanged());
      },
    },
  ]);
}

export { provideDgI18n };
