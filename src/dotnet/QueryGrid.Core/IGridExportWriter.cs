using QueryGrid.Abstractions;

namespace QueryGrid.Core;

/// <summary>
/// Writes a grid export for a specific format identifier.
/// Built-in CSV and Excel writers are registered by default; call <see cref="GridExportWriterRegistry.Default"/>.<see cref="GridExportWriterRegistry.Register"/>
/// for custom formats.
/// </summary>
public interface IGridExportWriter
{
  /// <summary>Format identifier handled by this writer (for example <see cref="GridExportFormats.Csv"/>).</summary>
  string Format { get; }

  /// <summary>HTTP <c>Content-Type</c> for downloads of this format.</summary>
  string ContentType { get; }

  /// <summary>File extension without a leading dot.</summary>
  string FileExtension { get; }

  /// <summary>
  /// Applies the export plan and writes rows to <paramref name="output"/> synchronously.
  /// </summary>
  GridExportResult Write<T>(
    IQueryable<T> source,
    GridExportRequest request,
    Stream output,
    GridOptions? gridOptions,
    GridExportOptions? exportOptions);

  /// <summary>
  /// Applies the export plan and writes rows to <paramref name="output"/> asynchronously.
  /// </summary>
  Task<GridExportResult> WriteAsync<T>(
    IQueryable<T> source,
    GridExportRequest request,
    Stream output,
    IGridExportAsyncCapabilities capabilities,
    GridOptions? gridOptions,
    GridExportOptions? exportOptions,
    CancellationToken cancellationToken);
}
