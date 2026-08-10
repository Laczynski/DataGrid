using DataGrid.Abstractions;
using DataGrid.Core.Internal;

namespace DataGrid.Core;

/// <summary>
/// Shared export execution for custom <see cref="IGridExportWriter"/> implementations.
/// Plans the query, counts matching rows, writes output, and builds <see cref="GridExportResult"/>.
/// </summary>
public static class GridExportPipeline
{
  /// <summary>Writes export rows for a planned query.</summary>
  public delegate Task<int> WritePlanAsync<T>(
    GridExportPlan<T> plan,
    IReadOnlyList<GridExportColumn> columns,
    Stream output,
    GridExportOptions options,
    GridExportContext context,
    CancellationToken cancellationToken);

  /// <summary>
  /// Plans the export, counts total matches, invokes <paramref name="writeAsync"/>, and returns export metadata.
  /// </summary>
  public static async Task<GridExportResult> RunAsync<T>(
    IQueryable<T> source,
    GridExportRequest request,
    Stream output,
    GridExportContext context,
    WritePlanAsync<T> writeAsync,
    CancellationToken cancellationToken)
  {
    ArgumentNullException.ThrowIfNull(source);
    ArgumentNullException.ThrowIfNull(request);
    ArgumentNullException.ThrowIfNull(output);
    ArgumentNullException.ThrowIfNull(context);
    ArgumentNullException.ThrowIfNull(writeAsync);

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
