import {
  getAllowedOperatorsForColumnType,
  type FilterOperator,
  type DgMessageTranslateFn,
} from "@laczynski/datagrid";
import type { SelectItem } from "primeng/api";
import { FilterMatchMode } from "primeng/api";
import type { GridColumnFilterType } from "./table/grid-column";

function resolveTranslate(translate?: DgMessageTranslateFn): DgMessageTranslateFn {
  return translate ?? ((_key, fallback) => fallback);
}

function operatorLabel(
  operator: FilterOperator,
  columnType: GridColumnFilterType | undefined,
  t: DgMessageTranslateFn,
): string {
  switch (operator) {
    case "contains":
      return t("filter.operator.contains", "Contains");
    case "notContains":
      return t("filter.operator.notContains", "Not contains");
    case "startsWith":
      return t("filter.operator.startsWith", "Starts with");
    case "endsWith":
      return t("filter.operator.endsWith", "Ends with");
    case "eq":
      return columnType === "date"
        ? t("filter.operator.dateIs", "Date is")
        : t("filter.operator.equals", "Equals");
    case "ne":
      return columnType === "date"
        ? t("filter.operator.dateIsNot", "Date is not")
        : t("filter.operator.notEquals", "Not equals");
    case "lt":
      return columnType === "date"
        ? t("filter.operator.dateBefore", "Date before")
        : t("filter.operator.lessThan", "Less than");
    case "lte":
      return t("filter.operator.lessOrEqual", "Less or equal");
    case "gt":
      return columnType === "date"
        ? t("filter.operator.dateAfter", "Date after")
        : t("filter.operator.greaterThan", "Greater than");
    case "gte":
      return t("filter.operator.greaterOrEqual", "Greater or equal");
    case "between":
      return t("filter.operator.between", "Between");
    case "in":
      return t("filter.operator.in", "In");
    case "notIn":
      return t("filter.operator.notIn", "Not in");
    case "isNull":
      return t("filter.operator.isEmpty", "Is empty");
    case "isNotNull":
      return t("filter.operator.isNotEmpty", "Is not empty");
    default:
      return operator;
  }
}

function operatorToMatchMode(
  operator: FilterOperator,
  columnType: GridColumnFilterType | undefined,
): string {
  const isDate = columnType === "date";

  switch (operator) {
    case "contains":
      return FilterMatchMode.CONTAINS;
    case "notContains":
      return FilterMatchMode.NOT_CONTAINS;
    case "startsWith":
      return FilterMatchMode.STARTS_WITH;
    case "endsWith":
      return FilterMatchMode.ENDS_WITH;
    case "in":
      return FilterMatchMode.IN;
    case "notIn":
      return "notIn";
    case "between":
      return FilterMatchMode.BETWEEN;
    case "eq":
      return isDate ? FilterMatchMode.DATE_IS : FilterMatchMode.EQUALS;
    case "ne":
      return isDate ? FilterMatchMode.DATE_IS_NOT : FilterMatchMode.NOT_EQUALS;
    case "lt":
      return isDate ? FilterMatchMode.DATE_BEFORE : FilterMatchMode.LESS_THAN;
    case "lte":
      return FilterMatchMode.LESS_THAN_OR_EQUAL_TO;
    case "gt":
      return isDate ? FilterMatchMode.DATE_AFTER : FilterMatchMode.GREATER_THAN;
    case "gte":
      return FilterMatchMode.GREATER_THAN_OR_EQUAL_TO;
    case "isNull":
      return FilterMatchMode.IS;
    case "isNotNull":
      return FilterMatchMode.IS_NOT;
    default:
      return FilterMatchMode.EQUALS;
  }
}

/** Match modes for a column type, including nullable operators when requested. */
export function buildMatchModeOptions(
  columnType: GridColumnFilterType | undefined,
  nullable = false,
  translate?: DgMessageTranslateFn,
): SelectItem[] | undefined {
  if (columnType === "enum") {
    return buildEnumMatchModeOptions(translate, nullable);
  }

  const operators = getAllowedOperatorsForColumnType(columnType, nullable);
  if (operators.length === 0) {
    return undefined;
  }

  const t = resolveTranslate(translate);
  return operators.map((operator) => ({
    label: operatorLabel(operator, columnType, t),
    value: operatorToMatchMode(operator, columnType),
  }));
}

/** Match modes for enum columns (`in` / `notIn`, plus null checks when nullable). */
export function buildEnumMatchModeOptions(
  translate?: DgMessageTranslateFn,
  nullable = false,
): SelectItem[] {
  const t = resolveTranslate(translate);
  const modes: SelectItem[] = [
    { label: t("filter.operator.in", "In"), value: FilterMatchMode.IN },
    { label: t("filter.operator.notIn", "Not in"), value: "notIn" },
  ];

  if (nullable) {
    modes.push(
      { label: t("filter.operator.equals", "Equals"), value: FilterMatchMode.EQUALS },
      { label: t("filter.operator.notEquals", "Not equals"), value: FilterMatchMode.NOT_EQUALS },
      { label: t("filter.operator.isEmpty", "Is empty"), value: FilterMatchMode.IS },
      { label: t("filter.operator.isNotEmpty", "Is not empty"), value: FilterMatchMode.IS_NOT },
    );
  }

  return modes;
}

/** Match modes for nullable columns, including PrimeNG `is` / `isNot` (empty / not empty). */
export function buildNullableMatchModeOptions(
  columnType: GridColumnFilterType | undefined,
  translate?: DgMessageTranslateFn,
): SelectItem[] | undefined {
  const t = resolveTranslate(translate);

  switch (columnType) {
    case "text":
      return [
        {
          label: t("filter.operator.startsWith", "Starts with"),
          value: FilterMatchMode.STARTS_WITH,
        },
        { label: t("filter.operator.contains", "Contains"), value: FilterMatchMode.CONTAINS },
        {
          label: t("filter.operator.notContains", "Not contains"),
          value: FilterMatchMode.NOT_CONTAINS,
        },
        { label: t("filter.operator.endsWith", "Ends with"), value: FilterMatchMode.ENDS_WITH },
        { label: t("filter.operator.equals", "Equals"), value: FilterMatchMode.EQUALS },
        { label: t("filter.operator.notEquals", "Not equals"), value: FilterMatchMode.NOT_EQUALS },
        { label: t("filter.operator.isEmpty", "Is empty"), value: FilterMatchMode.IS },
        { label: t("filter.operator.isNotEmpty", "Is not empty"), value: FilterMatchMode.IS_NOT },
      ];
    case "number":
      return [
        { label: t("filter.operator.equals", "Equals"), value: FilterMatchMode.EQUALS },
        { label: t("filter.operator.notEquals", "Not equals"), value: FilterMatchMode.NOT_EQUALS },
        { label: t("filter.operator.lessThan", "Less than"), value: FilterMatchMode.LESS_THAN },
        {
          label: t("filter.operator.lessOrEqual", "Less or equal"),
          value: FilterMatchMode.LESS_THAN_OR_EQUAL_TO,
        },
        {
          label: t("filter.operator.greaterThan", "Greater than"),
          value: FilterMatchMode.GREATER_THAN,
        },
        {
          label: t("filter.operator.greaterOrEqual", "Greater or equal"),
          value: FilterMatchMode.GREATER_THAN_OR_EQUAL_TO,
        },
        { label: t("filter.operator.isEmpty", "Is empty"), value: FilterMatchMode.IS },
        { label: t("filter.operator.isNotEmpty", "Is not empty"), value: FilterMatchMode.IS_NOT },
      ];
    case "date":
      return [
        { label: t("filter.operator.dateIs", "Date is"), value: FilterMatchMode.DATE_IS },
        {
          label: t("filter.operator.dateIsNot", "Date is not"),
          value: FilterMatchMode.DATE_IS_NOT,
        },
        {
          label: t("filter.operator.dateBefore", "Date before"),
          value: FilterMatchMode.DATE_BEFORE,
        },
        { label: t("filter.operator.dateAfter", "Date after"), value: FilterMatchMode.DATE_AFTER },
        { label: t("filter.operator.isEmpty", "Is empty"), value: FilterMatchMode.IS },
        { label: t("filter.operator.isNotEmpty", "Is not empty"), value: FilterMatchMode.IS_NOT },
      ];
    default:
      return undefined;
  }
}
