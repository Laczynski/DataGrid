using QueryGrid.Abstractions;
using QueryGrid.Core.Schema;

namespace QueryGrid.Core.Internal;

internal static class GridExportRunner
{
  internal delegate Task<int> WritePlanAsync<T>(
    GridExportExecutor.GridExportPlan<T> plan,
    IReadOnlyList<GridExportColumn> columns,
    Stream output,
    GridExportOptions options,
    GridExportContext context,
    CancellationToken cancellationToken);

  internal static async Task<GridExportResult> RunAsync<T>(
    IQueryable<T> source,
    GridExportRequest request,
    Stream output,
    GridExportContext context,
    WritePlanAsync<T> writeAsync,
    CancellationToken cancellationToken)
  {
    var plan = GridExportExecutor.Plan(source, request, context.GridOptions, context.ExportOptions);
    var totalMatchingCount = await context.CountAsync(plan.FilteredQuery, cancellationToken);
    var exportedRowCount = await writeAsync(
      plan,
      request.Columns.ToList(),
      output,
      context.ExportOptions,
      context,
      cancellationToken);

    return new GridExportResult
    {
      TotalMatchingCount = totalMatchingCount,
      ExportedRowCount = exportedRowCount,
      Truncated = totalMatchingCount > context.ExportOptions.MaxExportRows
    };
  }
}
