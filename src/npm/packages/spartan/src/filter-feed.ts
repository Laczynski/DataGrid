import {
  formatFilterDisplayValue,
  isFilterCondition,
  isFilterGroup,
  type FilterCondition,
  type FilterNode,
  type GridQuery,
  type DgMessageTranslateFn,
} from "@laczynski/datagrid";
import type { GridColumn } from "./table/grid-column";

export type FilterFeedSegmentKind = "search" | "condition" | "logic" | "paren" | "extra";

export type FilterFeedSegment = {
  id: string;
  kind: FilterFeedSegmentKind;
  text: string;
  removable: boolean;
  path?: number[];
  field?: string;
  extraId?: string;
};

export type BuildGridFilterFeedOptions = {
  translate?: DgMessageTranslateFn;
  extras?: ReadonlyArray<{ id: string; label: string }>;
};

function formatValue(column: GridColumn | undefined, value: unknown): string {
  return formatFilterDisplayValue(column?.filter?.type, value);
}

function describeCondition(
  column: GridColumn | undefined,
  condition: FilterCondition,
  t: DgMessageTranslateFn,
): string {
  const header = column?.header ?? condition.field;
  const value = condition.value;
  const formatted = formatValue(column, value);
  const text = String(value ?? "");

  switch (condition.operator) {
    case "contains":
      return t("filter.feed.contains", `${header} contains "${text}"`, { header, value: text });
    case "notContains":
      return t("filter.feed.notContains", `${header} does not contain "${text}"`, {
        header,
        value: text,
      });
    case "startsWith":
      return t("filter.feed.startsWith", `${header} starts with "${text}"`, {
        header,
        value: text,
      });
    case "endsWith":
      return t("filter.feed.endsWith", `${header} ends with "${text}"`, { header, value: text });
    case "eq":
      if (column?.filter?.type === "boolean") {
        const trueLabel = column.filter.trueLabel ?? t("filter.boolean.yes", "Yes");
        const falseLabel = column.filter.falseLabel ?? t("filter.boolean.no", "No");
        const boolLabel = value ? trueLabel : falseLabel;
        return t("filter.feed.equals", `${header} = ${boolLabel}`, { header, value: boolLabel });
      }
      return t("filter.feed.equals", `${header} = ${formatted}`, { header, value: formatted });
    case "ne":
      return t("filter.feed.notEquals", `${header} ≠ ${formatted}`, {
        header,
        value: formatted,
      });
    case "in": {
      const options = column?.filter?.options ?? [];
      const values = Array.isArray(value) ? value : [value];
      const labels = values.map((entry) => {
        const option = options.find((candidate) => candidate.value === entry);
        return option ? option.label : String(entry);
      });
      const joined = labels.join(", ");
      return t("filter.feed.in", `${header} in ${joined}`, { header, value: joined });
    }
    case "notIn": {
      const options = column?.filter?.options ?? [];
      const values = Array.isArray(value) ? value : [value];
      const labels = values.map((entry) => {
        const option = options.find((candidate) => candidate.value === entry);
        return option ? option.label : String(entry);
      });
      const joined = labels.join(", ");
      return t("filter.feed.notIn", `${header} not in ${joined}`, { header, value: joined });
    }
    case "between": {
      const range = Array.isArray(value) ? value : [];
      const start = formatValue(column, range[0]);
      const end = formatValue(column, range[1]);
      return t("filter.feed.between", `${header} between ${start} and ${end}`, {
        header,
        start,
        end,
      });
    }
    case "gte":
      return t("filter.feed.gte", `${header} ≥ ${formatted}`, { header, value: formatted });
    case "lte":
      return t("filter.feed.lte", `${header} ≤ ${formatted}`, { header, value: formatted });
    case "gt":
      return t("filter.feed.gt", `${header} > ${formatted}`, { header, value: formatted });
    case "lt":
      return t("filter.feed.lt", `${header} < ${formatted}`, { header, value: formatted });
    case "isNull":
      return t("filter.feed.isEmpty", `${header} is empty`, { header });
    case "isNotNull":
      return t("filter.feed.isNotEmpty", `${header} is not empty`, { header });
    default:
      return t("filter.feed.default", `${header} ${formatted}`, { header, value: formatted });
  }
}

function pushSeparator(
  segments: FilterFeedSegment[],
  nextId: () => string,
  t: DgMessageTranslateFn,
): void {
  segments.push({
    id: nextId(),
    kind: "logic",
    text: ` ${t("filter.feed.separator", "·")} `,
    removable: false,
  });
}

function appendFilterNode(
  segments: FilterFeedSegment[],
  node: FilterNode,
  path: number[],
  wrapGroup: boolean,
  columnByField: Map<string, GridColumn>,
  t: DgMessageTranslateFn,
  nextId: () => string,
): void {
  if (isFilterCondition(node)) {
    segments.push({
      id: nextId(),
      kind: "condition",
      text: describeCondition(columnByField.get(node.field), node, t),
      removable: true,
      path: [...path],
      field: node.field,
    });
    return;
  }

  if (!isFilterGroup(node) || node.conditions.length === 0) {
    return;
  }

  if (wrapGroup) {
    segments.push({ id: nextId(), kind: "paren", text: "(", removable: false });
  }

  const logicText = node.logic === "or" ? t("filter.feed.or", "OR") : t("filter.feed.and", "AND");

  node.conditions.forEach((child, index) => {
    if (index > 0) {
      segments.push({
        id: nextId(),
        kind: "logic",
        text: ` ${logicText} `,
        removable: false,
      });
    }

    appendFilterNode(
      segments,
      child,
      [...path, index],
      isFilterGroup(child),
      columnByField,
      t,
      nextId,
    );
  });

  if (wrapGroup) {
    segments.push({ id: nextId(), kind: "paren", text: ")", removable: false });
  }
}

/** Builds an interactive filter feed (readable query segments) from the grid query. */
export function buildGridFilterFeed(
  query: GridQuery,
  columns: ReadonlyArray<GridColumn<any>>,
  options?: BuildGridFilterFeedOptions,
): FilterFeedSegment[] {
  const t: DgMessageTranslateFn = options?.translate ?? ((_key, fallback) => fallback);
  const columnByField = new Map<string, GridColumn>(
    columns.map((column) => [column.field, column]),
  );
  const segments: FilterFeedSegment[] = [];
  let sequence = 0;
  const nextId = () => `feed-${sequence++}`;

  const search = query.search?.trim();
  if (search) {
    segments.push({
      id: nextId(),
      kind: "search",
      text: t("filter.feed.search", `Search "${search}"`, { value: search }),
      removable: true,
    });
  }

  if (query.filter) {
    if (segments.length > 0) {
      pushSeparator(segments, nextId, t);
    }
    appendFilterNode(segments, query.filter, [], false, columnByField, t, nextId);
  }

  for (const extra of options?.extras ?? []) {
    if (segments.length > 0) {
      pushSeparator(segments, nextId, t);
    }
    segments.push({
      id: nextId(),
      kind: "extra",
      text: extra.label,
      removable: true,
      extraId: extra.id,
    });
  }

  return segments;
}
