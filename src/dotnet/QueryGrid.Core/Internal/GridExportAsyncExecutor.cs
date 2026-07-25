using QueryGrid.Abstractions;
using QueryGrid.Core.Schema;

namespace QueryGrid.Core.Internal;

internal static class GridExportAsyncExecutor
{
  internal static async Task<GridExportResult> ExecuteAsync<T>(
    IQueryable<T> source,
    GridExportRequest request,
    Stream output,
    GridOptions gridOptions,
    GridExportOptions exportOptions,
    IGridExportAsyncCapabilities capabilities,
    Func<GridExportExecutor.GridExportPlan<T>, IReadOnlyList<GridExportColumn>, Stream, GridExportOptions, CancellationToken, Task<int>> writeAsync,
    CancellationToken cancellationToken)
  {
    var plan = GridExportExecutor.Plan(source, request, gridOptions, exportOptions);
    var totalMatchingCount = await capabilities.CountAsync(plan.FilteredQuery, cancellationToken);
    var exportedRowCount = await writeAsync(
      plan,
      request.Columns.ToList(),
      output,
      exportOptions,
      cancellationToken);

    return new GridExportResult
    {
      TotalMatchingCount = totalMatchingCount,
      ExportedRowCount = exportedRowCount,
      Truncated = totalMatchingCount > exportOptions.MaxExportRows
    };
  }
}
