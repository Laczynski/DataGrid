using Microsoft.EntityFrameworkCore;
using QueryGrid.Abstractions;
using QueryGrid.Core;
using QueryGrid.Core.Internal;
using QueryGrid.EntityFrameworkCore.Internal;

namespace QueryGrid.EntityFrameworkCore;

/// <summary>
/// Entity Framework Core entry points for executing a <see cref="GridQuery"/> asynchronously
/// against the database (server-side filtering, sorting, counting and paging).
/// </summary>
public static class GridEntityFrameworkExtensions
{
  /// <summary>
  /// Applies filter, search, multi-sort and paging, then asynchronously executes the total count
  /// and the current page against the underlying provider and returns a <see cref="GridResult{T}"/>.
  /// </summary>
  public static async Task<GridResult<T>> ToGridResultAsync<T>(
    this IQueryable<T> source,
    GridQuery query,
    GridOptions? options = null,
    CancellationToken cancellationToken = default)
  {
    ArgumentNullException.ThrowIfNull(source);
    ArgumentNullException.ThrowIfNull(query);
    options ??= GridOptions.Default;

    var plan = GridResultExecutor.Plan(source, query, options);
    var totalCount = await plan.FilteredQuery.CountAsync(cancellationToken);
    var items = await plan.PageQuery.ToListAsync(cancellationToken);

    return new GridResult<T>(items, totalCount, plan.Skip, plan.Take, plan.EffectiveSort);
  }

  /// <summary>
  /// Applies the export plan, streams matching rows as CSV to <paramref name="output"/>,
  /// and returns export metadata (total match count and truncation flag).
  /// </summary>
  public static Task<GridExportResult> ExportToCsvAsync<T>(
    this IQueryable<T> source,
    GridExportRequest request,
    Stream output,
    GridOptions? gridOptions = null,
    GridExportOptions? exportOptions = null,
    CancellationToken cancellationToken = default)
  {
    ValidateFormat(request, GridExportFormats.Csv, "CSV export");
    return ExportCoreAsync(source, request, output, gridOptions, exportOptions, cancellationToken);
  }

  /// <summary>
  /// Applies the export plan, writes matching rows as an Excel workbook to <paramref name="output"/>,
  /// and returns export metadata.
  /// </summary>
  public static Task<GridExportResult> ExportToXlsxAsync<T>(
    this IQueryable<T> source,
    GridExportRequest request,
    Stream output,
    GridOptions? gridOptions = null,
    GridExportOptions? exportOptions = null,
    CancellationToken cancellationToken = default)
  {
    ValidateFormat(request, GridExportFormats.Xlsx, "Excel export");
    return ExportCoreAsync(source, request, output, gridOptions, exportOptions, cancellationToken);
  }

  /// <summary>
  /// Exports rows using <see cref="GridExportRequest.Format"/> — built-in and registered writers are supported.
  /// </summary>
  public static Task<GridExportResult> ExportAsync<T>(
    this IQueryable<T> source,
    GridExportRequest request,
    Stream output,
    GridOptions? gridOptions = null,
    GridExportOptions? exportOptions = null,
    CancellationToken cancellationToken = default)
    => ExportCoreAsync(source, request, output, gridOptions, exportOptions, cancellationToken);

  private static Task<GridExportResult> ExportCoreAsync<T>(
    IQueryable<T> source,
    GridExportRequest request,
    Stream output,
    GridOptions? gridOptions,
    GridExportOptions? exportOptions,
    CancellationToken cancellationToken)
  {
    ArgumentNullException.ThrowIfNull(source);
    ArgumentNullException.ThrowIfNull(request);
    ArgumentNullException.ThrowIfNull(output);

    gridOptions ??= GridOptions.Default;
    exportOptions ??= GridExportOptions.Default;

    var registry = exportOptions.Writers ?? GridExportWriterRegistry.Default;
    var writer = registry.GetRequired(request.Format);
    var context = GridExportContext.Create(gridOptions, exportOptions, EfGridExportQueryExecutor.Instance);
    return writer.WriteAsync(source, request, output, context, cancellationToken);
  }

  private static void ValidateFormat(GridExportRequest request, string expectedFormat, string operationName)
  {
    ArgumentNullException.ThrowIfNull(request);

    if (!string.Equals(request.Format, expectedFormat, StringComparison.OrdinalIgnoreCase))
    {
      throw new GridValidationException(
        GridValidationCodes.ExportFormatNotSupported,
        $"Export format '{request.Format}' is not supported by {operationName}.");
    }
  }
}
