using QueryGrid.Abstractions;
using QueryGrid.Core.Internal;

namespace QueryGrid.Core;

/// <summary>
/// Entry points for exporting grid data from an <see cref="IQueryable{T}"/>.
/// </summary>
public static class GridExportExtensions
{
  private static GridOptions ResolveGridOptions(GridOptions? options) => options ?? GridOptions.Default;

  private static GridExportOptions ResolveExportOptions(GridExportOptions? options) => options ?? GridExportOptions.Default;

  private static GridExportWriterRegistry ResolveWriters(GridExportOptions exportOptions)
    => exportOptions.Writers ?? GridExportWriterRegistry.Default;

  /// <summary>
  /// Applies filter, search, optional selected-key filter, sort and export row cap.
  /// Paging from <see cref="GridQuery.Skip"/> / <see cref="GridQuery.Take"/> is ignored.
  /// </summary>
  public static IQueryable<T> ApplyGridExport<T>(
    this IQueryable<T> source,
    GridExportRequest request,
    GridOptions? gridOptions = null,
    GridExportOptions? exportOptions = null)
  {
    ArgumentNullException.ThrowIfNull(source);
    ArgumentNullException.ThrowIfNull(request);
    return GridExportExecutor.Plan(source, request, ResolveGridOptions(gridOptions), ResolveExportOptions(exportOptions)).ExportQuery;
  }

  /// <summary>
  /// Exports rows to CSV synchronously (in-memory providers). For database-backed sources use
  /// the Entity Framework Core <c>ExportToCsvAsync</c> extension.
  /// </summary>
  public static GridExportResult ExportToCsv<T>(
    this IQueryable<T> source,
    GridExportRequest request,
    Stream output,
    GridOptions? gridOptions = null,
    GridExportOptions? exportOptions = null)
  {
    ValidateFormat(request, GridExportFormats.Csv, "CSV export");
    return ExportCore(source, request, output, gridOptions, exportOptions);
  }

  /// <summary>
  /// Exports rows to Excel synchronously (in-memory providers). For database-backed sources use
  /// the Entity Framework Core <c>ExportToXlsxAsync</c> extension.
  /// </summary>
  public static GridExportResult ExportToXlsx<T>(
    this IQueryable<T> source,
    GridExportRequest request,
    Stream output,
    GridOptions? gridOptions = null,
    GridExportOptions? exportOptions = null)
  {
    ValidateFormat(request, GridExportFormats.Xlsx, "Excel export");
    return ExportCore(source, request, output, gridOptions, exportOptions);
  }

  /// <summary>
  /// Exports rows using <see cref="GridExportRequest.Format"/> — built-in and registered writers are supported.
  /// For database-backed sources use the Entity Framework Core <c>ExportAsync</c> extension.
  /// </summary>
  public static GridExportResult Export<T>(
    this IQueryable<T> source,
    GridExportRequest request,
    Stream output,
    GridOptions? gridOptions = null,
    GridExportOptions? exportOptions = null)
    => ExportCore(source, request, output, gridOptions, exportOptions);

  private static GridExportResult ExportCore<T>(
    IQueryable<T> source,
    GridExportRequest request,
    Stream output,
    GridOptions? gridOptions,
    GridExportOptions? exportOptions)
  {
    ArgumentNullException.ThrowIfNull(source);
    ArgumentNullException.ThrowIfNull(request);
    ArgumentNullException.ThrowIfNull(output);

    var grid = ResolveGridOptions(gridOptions);
    var export = ResolveExportOptions(exportOptions);
    var writer = ResolveWriters(export).GetRequired(request.Format);
    var context = GridExportContext.InMemory(grid, export);
    return writer.WriteAsync(source, request, output, context, CancellationToken.None).GetAwaiter().GetResult();
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
