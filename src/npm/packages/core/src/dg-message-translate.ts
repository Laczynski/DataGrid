export type DgMessageTranslateFn = (
  key: string,
  fallback: string,
  params?: Record<string, string | number>,
) => string;
