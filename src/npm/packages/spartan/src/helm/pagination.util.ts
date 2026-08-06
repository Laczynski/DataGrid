export type PageToken = number | "ellipsis";

export function buildPageTokens(
  currentPage: number,
  totalPages: number,
  maxVisible: number,
): PageToken[] {
  if (totalPages <= 1) {
    return totalPages === 1 ? [1] : [];
  }

  const max = Math.max(3, maxVisible);
  if (totalPages <= max) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const tokens: PageToken[] = [];
  const side = Math.floor((max - 3) / 2);
  let start = Math.max(2, currentPage - side);
  let end = Math.min(totalPages - 1, currentPage + side);

  if (currentPage - 1 <= side) {
    end = Math.min(totalPages - 1, max - 1);
  }

  if (totalPages - currentPage <= side) {
    start = Math.max(2, totalPages - (max - 2));
  }

  tokens.push(1);
  if (start > 2) {
    tokens.push("ellipsis");
  }

  for (let page = start; page <= end; page++) {
    tokens.push(page);
  }

  if (end < totalPages - 1) {
    tokens.push("ellipsis");
  }

  tokens.push(totalPages);
  return tokens;
}

export function paginationRangeLabel(
  currentPage: number,
  pageSize: number,
  totalItems: number,
): string {
  if (totalItems === 0) {
    return "0";
  }

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);
  return `${start}–${end} of ${totalItems}`;
}
