import { describe, expect, it, vi } from "vitest";
import {
  applyGridQueryToPrimeTable,
  buildPrimeTableFilters,
  coerceOperatorForColumnType,
  ensurePrimeFieldFilters,
  isSameGridPatch,
  lazyLoadEventToGridPatch,
  mapLazyLoadSort,
  mapPrimeFiltersToGridFilter,
  needsPrimeTableQuerySync,
  syncPrimeTableFieldFilters,
} from "./lazy-load-mapper.js";
import type { GridColumn } from "./table/grid-column.js";

const columns: GridColumn[] = [
  { field: "Name", header: "Name", filter: { type: "text" } },
  {
    field: "Status",
    header: "Status",
    filter: {
      type: "enum",
      options: [
        { label: "Active", value: 1 },
        { label: "Pending", value: 0 },
      ],
    },
  },
];

describe("lazy-load-mapper", () => {
  it("maps lazy-load sort metadata", () => {
    expect(
      mapLazyLoadSort({
        multiSortMeta: [{ field: "Name", order: -1 }],
      }),
    ).toEqual([{ field: "Name", desc: true }]);
  });

  it("maps PrimeNG filters including notIn", () => {
    const filter = mapPrimeFiltersToGridFilter(
      {
        Status: { value: [0, 1], matchMode: "notIn", operator: "and" },
      },
      columns,
    );

    expect(filter).toEqual({ field: "Status", operator: "notIn", value: [0, 1] });
  });

  it("maps Match Any as a field-level or group", () => {
    const filter = mapPrimeFiltersToGridFilter(
      {
        Name: [
          { value: "a", matchMode: "contains", operator: "or" },
          { value: "b", matchMode: "contains", operator: "or" },
        ],
      },
      columns,
    );

    expect(filter).toEqual({
      logic: "or",
      conditions: [
        { field: "Name", operator: "contains", value: "a" },
        { field: "Name", operator: "contains", value: "b" },
      ],
    });
  });

  it("round-trips notIn through buildPrimeTableFilters", () => {
    const filter = {
      logic: "and" as const,
      conditions: [{ field: "Status", operator: "notIn" as const, value: [0] }],
    };

    expect(buildPrimeTableFilters(filter, columns).Status?.[0]?.matchMode).toBe("notIn");
  });

  it("round-trips Match Any operator through buildPrimeTableFilters", () => {
    const filter = {
      logic: "or" as const,
      conditions: [
        { field: "Name", operator: "contains" as const, value: "a" },
        { field: "Name", operator: "contains" as const, value: "b" },
      ],
    };

    const built = buildPrimeTableFilters(filter, columns).Name;
    expect(built?.map((meta) => meta.operator)).toEqual(["or", "or"]);
  });

  it("lazyLoadEventToGridPatch maps paging and search", () => {
    expect(
      lazyLoadEventToGridPatch(
        {
          first: 20,
          rows: 10,
          globalFilter: "  find me ",
          filters: {},
        },
        columns,
      ),
    ).toEqual({
      skip: 20,
      take: 10,
      sort: [],
      filter: null,
      search: "find me",
    });
  });

  it("isSameGridPatch compares structural filter and sort", () => {
    const current = {
      skip: 0,
      take: 20,
      sort: [{ field: "Name" }],
      filter: { field: "Name", operator: "contains" as const, value: "a" },
    };

    expect(
      isSameGridPatch(current, {
        skip: 0,
        take: 20,
        sort: [{ field: "Name" }],
        filter: { field: "Name", operator: "contains", value: "a" },
      }),
    ).toBe(true);

    expect(
      isSameGridPatch(current, {
        filter: { field: "Name", operator: "contains", value: "b" },
      }),
    ).toBe(false);
  });

  it("coerceOperatorForColumnType keeps notIn for enum", () => {
    expect(coerceOperatorForColumnType("notIn", "enum")).toBe("notIn");
  });

  it("applyGridQueryToPrimeTable keeps empty constraint arrays for inactive fields", () => {
    const table = {
      filters: {
        global: { value: "", matchMode: "contains" },
        Name: [{ value: "a", matchMode: "contains", operator: "and" }],
      },
      filterGlobal: vi.fn(),
      multiSortMeta: null,
      tableService: { onSort() {} },
    };

    applyGridQueryToPrimeTable(table as never, { filter: null, search: undefined }, columns);

    expect(table.filters.Name).toEqual([{ value: null, matchMode: "contains", operator: "and" }]);
    expect(table.filters.Status).toEqual([{ value: null, matchMode: "in", operator: "and" }]);
    expect(table.filterGlobal).not.toHaveBeenCalled();
    (table.filters.Name as Array<{ operator: string }>).forEach((meta) => {
      meta.operator = "or";
    });
  });

  it("applyGridQueryToPrimeTable preserves constraint object identity while typing syncs", () => {
    const nameConstraint = { value: "ac", matchMode: "contains", operator: "and" };
    const statusConstraint = { value: null, matchMode: "in", operator: "and" };
    const nameFilters = [nameConstraint];
    const statusFilters = [statusConstraint];
    const table = {
      filters: {
        global: { value: "", matchMode: "contains" },
        Name: nameFilters,
        Status: statusFilters,
      },
      filterGlobal: vi.fn(),
      multiSortMeta: null,
      tableService: { onSort() {} },
    };

    applyGridQueryToPrimeTable(
      table as never,
      {
        filter: { field: "Name", operator: "contains", value: "acme" },
        search: undefined,
      },
      columns,
    );

    expect(table.filters.Name).toBe(nameFilters);
    expect(nameFilters[0]).toBe(nameConstraint);
    expect(nameConstraint.value).toBe("acme");
    expect(table.filters.Status).toBe(statusFilters);
    expect(statusFilters[0]).toBe(statusConstraint);
    expect(statusConstraint.value).toBeNull();
    expect(table.filterGlobal).not.toHaveBeenCalled();
  });

  it("applyGridQueryToPrimeTable keeps in-progress drafts when resetMissingFields is false", () => {
    const draft = { value: "draft", matchMode: "contains", operator: "and" };
    const nameFilters = [draft];
    const table = {
      filters: {
        global: { value: "", matchMode: "contains" },
        Name: nameFilters,
        Status: [{ value: null, matchMode: "in", operator: "and" }],
      },
      filterGlobal: vi.fn(),
      multiSortMeta: null,
      tableService: { onSort() {} },
    };

    applyGridQueryToPrimeTable(table as never, { filter: null, search: "find" }, columns, {
      resetMissingFields: false,
    });

    expect(table.filters.Name).toBe(nameFilters);
    expect(nameFilters[0]).toBe(draft);
    expect(draft.value).toBe("draft");
    expect(table.filters.global).toEqual({ value: "find", matchMode: "contains" });
    expect(table.filterGlobal).not.toHaveBeenCalled();
  });

  it("applyGridQueryToPrimeTable clears missing fields when resetMissingFields is true", () => {
    const draft = { value: "draft", matchMode: "contains", operator: "and" };
    const table = {
      filters: {
        global: { value: "", matchMode: "contains" },
        Name: [draft],
      },
      filterGlobal: vi.fn(),
      multiSortMeta: null,
      tableService: { onSort() {} },
    };

    applyGridQueryToPrimeTable(table as never, { filter: null, search: undefined }, columns, {
      resetMissingFields: true,
    });

    expect(draft.value).toBeNull();
  });

  it("ensurePrimeFieldFilters mutates existing menu constraints in place", () => {
    const first = { value: "a", matchMode: "contains", operator: "and" };
    const second = { value: "b", matchMode: "contains", operator: "and" };
    const existing = [first, second];

    const next = ensurePrimeFieldFilters(
      existing,
      [
        { value: "x", matchMode: "startsWith", operator: "or" },
        { value: "y", matchMode: "endsWith", operator: "or" },
      ],
      columns[0],
    );

    expect(next).toBe(existing);
    expect(existing[0]).toBe(first);
    expect(existing[1]).toBe(second);
    expect(first).toEqual({ value: "x", matchMode: "startsWith", operator: "or" });
    expect(second).toEqual({ value: "y", matchMode: "endsWith", operator: "or" });
  });

  it("ensurePrimeFieldFilters shrinks multi-rule arrays when clearing", () => {
    const first = { value: "a", matchMode: "contains", operator: "or" };
    const existing = [first, { value: "b", matchMode: "contains", operator: "or" }];

    const next = ensurePrimeFieldFilters(existing, undefined, columns[0]);

    expect(next).toBe(existing);
    expect(existing).toHaveLength(1);
    expect(existing[0]).toBe(first);
    expect(first).toEqual({ value: null, matchMode: "contains", operator: "and" });
  });

  it("syncPrimeTableFieldFilters resets cleared fields to empty constraints in place", () => {
    const first = { value: "a", matchMode: "contains", operator: "or" };
    const nameFilters = [first, { value: "b", matchMode: "contains", operator: "or" }];
    const table = {
      filters: {
        Name: nameFilters,
      },
    };

    syncPrimeTableFieldFilters(table as never, "Name", null, columns);

    expect(table.filters.Name).toBe(nameFilters);
    expect(nameFilters).toHaveLength(1);
    expect(nameFilters[0]).toBe(first);
    expect(first).toEqual({ value: null, matchMode: "contains", operator: "and" });
  });

  it("needsPrimeTableQuerySync ignores empty placeholder constraints", () => {
    const table = {
      filters: {
        global: { value: "", matchMode: "contains" },
        Name: [{ value: null, matchMode: "contains", operator: "and" }],
        Status: [{ value: null, matchMode: "in", operator: "and" }],
      },
      multiSortMeta: null,
    };

    expect(
      needsPrimeTableQuerySync(
        table as never,
        { skip: 0, take: 20, sort: [], filter: null, search: "" },
        columns,
      ),
    ).toBe(false);
  });

  it("needsPrimeTableQuerySync detects applied filter drift", () => {
    const table = {
      filters: {
        global: { value: "", matchMode: "contains" },
        Name: [{ value: "old", matchMode: "contains", operator: "and" }],
      },
      multiSortMeta: null,
    };

    expect(
      needsPrimeTableQuerySync(
        table as never,
        {
          skip: 0,
          take: 20,
          sort: [],
          filter: { field: "Name", operator: "contains", value: "new" },
          search: "",
        },
        columns,
      ),
    ).toBe(true);
  });
});
