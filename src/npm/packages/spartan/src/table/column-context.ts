export interface DgColumnContext<T = unknown> {
  $implicit: T;
  row: T;
  column: string;
}
