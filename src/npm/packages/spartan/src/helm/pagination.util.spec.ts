import { describe, expect, it } from "vitest";
import { buildPageTokens, paginationRangeLabel } from "./pagination.util";

describe("pagination.util", () => {
  it("builds numbered tokens with ellipsis", () => {
    expect(buildPageTokens(5, 10, 5)).toEqual([1, "ellipsis", 4, 5, 6, "ellipsis", 10]);
  });

  it("returns all pages when total is within max visible", () => {
    expect(buildPageTokens(2, 4, 5)).toEqual([1, 2, 3, 4]);
  });

  it("formats range label", () => {
    expect(paginationRangeLabel(2, 20, 45)).toBe("21–40 of 45");
    expect(paginationRangeLabel(1, 20, 0)).toBe("0");
  });
});
