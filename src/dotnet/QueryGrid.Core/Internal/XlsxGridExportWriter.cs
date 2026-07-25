using QueryGrid.Abstractions;

namespace QueryGrid.Core.Internal;

internal sealed class XlsxGridExportWriter : IGridExportWriter
{
  public string Format => GridExportFormats.Xlsx;

  public string ContentType => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

  public string FileExtension => "xlsx";

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
      static (plan, columns, stream, options) => XlsxGridExporter.Write(
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
      async (plan, columns, stream, options, ct) =>
      {
        var items = await MaterializeAsync(capabilities.StreamAsync(plan.ExportQuery, ct), ct);
        return await XlsxGridExporter.WriteAsync(items, columns, plan.ExportFields, stream, options, ct);
      },
      cancellationToken);

  private static async Task<List<T>> MaterializeAsync<T>(IAsyncEnumerable<T> rows, CancellationToken cancellationToken)
  {
    var items = new List<T>();
    await foreach (var item in rows.WithCancellation(cancellationToken))
    {
      items.Add(item);
    }

    return items;
  }
}
