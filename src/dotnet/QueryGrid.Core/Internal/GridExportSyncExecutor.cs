using QueryGrid.Abstractions;
using QueryGrid.Core.Schema;

namespace QueryGrid.Core.Internal;

internal static class GridExportSyncExecutor
{
  internal static GridExportResult Execute<T>(
    IQueryable<T> source,
    GridExportRequest request,
    Stream output,
    GridOptions gridOptions,
    GridExportOptions exportOptions,
    Func<GridExportExecutor.GridExportPlan<T>, IReadOnlyList<GridExportColumn>, Stream, GridExportOptions, int> write)
  {
    var plan = GridExportExecutor.Plan(source, request, gridOptions, exportOptions);
    var totalMatchingCount = plan.FilteredQuery.Count();
    var exportedRowCount = write(
      plan,
      request.Columns.ToList(),
      output,
      exportOptions);

    return new GridExportResult
    {
      TotalMatchingCount = totalMatchingCount,
      ExportedRowCount = exportedRowCount,
      Truncated = totalMatchingCount > exportOptions.MaxExportRows
    };
  }
}
