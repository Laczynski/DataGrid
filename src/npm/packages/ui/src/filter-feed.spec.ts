import { removeFilterAtPath } from "@query-grid/core";
import { describe, expect, it } from "vitest";
import { buildGridFilterFeed } from "./filter-feed.js";
import type { GridColumn } from "./table/grid-column.js";

const columns: GridColumn[] = [
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
  { field: "Name", header: "Name", filter: { type: "text" } },
];

describe("filter-feed", () => {
  it("builds a readable query with AND/OR and search", () => {
    const segments = buildGridFilterFeed(
      {
        search: "acme",
        filter: {
          logic: "and",
          conditions: [
            {
              logic: "or",
              conditions: [
                { field: "Name", operator: "contains", value: "a" },
                { field: "Name", operator: "contains", value: "b" },
              ],
            },
            { field: "Status", operator: "notIn", value: [0] },
          ],
        },
      },
      columns,
    );

    expect(segments.map((segment) => segment.text).join("")).toBe(
      'Search "acme" · (Name contains "a" OR Name contains "b") AND Status not in Pending',
    );
  });

  it("paths allow removing a single OR branch", () => {
    const filter = {
      logic: "or" as const,
      conditions: [
        { field: "Name", operator: "contains" as const, value: "a" },
        { field: "Name", operator: "contains" as const, value: "b" },
      ],
    };

    const segments = buildGridFilterFeed({ filter }, columns);
    const first = segments.find((segment) => segment.kind === "condition");
    expect(first?.path).toEqual([0]);
    expect(removeFilterAtPath(filter, first!.path!)).toEqual({
      field: "Name",
      operator: "contains",
      value: "b",
    });
  });
});
