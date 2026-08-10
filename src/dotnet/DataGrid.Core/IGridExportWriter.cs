using DataGrid.Abstractions;

namespace DataGrid.Core;

/// <summary>
/// Writes a grid export for a specific format identifier.
/// Built-in CSV and Excel writers are registered on <see cref="GridExportWriterRegistry.Default"/>.
/// Custom writers can delegate to <see cref="GridExportPipeline.RunAsync"/> for shared planning and metadata.
/// </summary>
public interface IGridExportWriter
{
  /// <summary>Format identifier handled by this writer (for example <see cref="GridExportFormats.Csv"/>).</summary>
  string Format { get; }

  /// <summary>HTTP <c>Content-Type</c> for downloads of this format.</summary>
  string ContentType { get; }

  /// <summary>File extension without a leading dot.</summary>
  string FileExtension { get; }

  /// <summary>Applies the export plan and writes rows to <paramref name="output"/>.</summary>
  Task<GridExportResult> WriteAsync<T>(
    IQueryable<T> source,
    GridExportRequest request,
    Stream output,
    GridExportContext context,
    CancellationToken cancellationToken);
}
