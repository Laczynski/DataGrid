import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from "@angular/core";

export interface DgI18nConfig {
  enabled: boolean;
  prefix: string;
}

export type DgTranslateFn = (key: string, params?: Record<string, unknown>) => string | undefined;

export const DG_I18N_CONFIG = new InjectionToken<DgI18nConfig>("DG_I18N_CONFIG", {
  providedIn: "root",
  factory: () => ({
    enabled: false,
    prefix: "qg",
  }),
});

export const DG_TRANSLATE_FN = new InjectionToken<DgTranslateFn | null>("DG_TRANSLATE_FN");

export function provideDgI18n(config: Partial<DgI18nConfig> = {}): EnvironmentProviders {
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
      useValue: null,
    },
  ]);
}
