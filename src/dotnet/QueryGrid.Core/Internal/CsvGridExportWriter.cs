using QueryGrid.Abstractions;

namespace QueryGrid.Core.Internal;

internal sealed class CsvGridExportWriter : IGridExportWriter
{
  public string Format => GridExportFormats.Csv;

  public string ContentType => "text/csv";

  public string FileExtension => "csv";

  public GridExportResult Write<T>(
    IQueryable<T> source,
    GridExportRequest request,
    Stream output,
    GridOptions? gridOptions,
    GridExportOptions? exportOptions)
    => GridExportSyncExecutor.Execute(
      source,
      request,
      output,
      gridOptions ?? GridOptions.Default,
      exportOptions ?? GridExportOptions.Default,
      static (plan, columns, stream, options) => CsvGridExporter.Write(
        plan.ExportQuery,
        columns,
        plan.ExportFields,
        stream,
        options));

  public Task<GridExportResult> WriteAsync<T>(
    IQueryable<T> source,
    GridExportRequest request,
    Stream output,
    IGridExportAsyncCapabilities capabilities,
    GridOptions? gridOptions,
    GridExportOptions? exportOptions,
    CancellationToken cancellationToken)
    => GridExportAsyncExecutor.ExecuteAsync(
      source,
      request,
      output,
      gridOptions ?? GridOptions.Default,
      exportOptions ?? GridExportOptions.Default,
      capabilities,
      (plan, columns, stream, options, ct) => CsvGridExporter.WriteAsync(
        capabilities.StreamAsync(plan.ExportQuery, ct),
        columns,
        plan.ExportFields,
        stream,
        options,
        ct),
      cancellationToken);
}
