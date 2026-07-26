using QueryGrid.Abstractions;

namespace QueryGrid.Core.Internal;

internal static class BuiltInGridExportWriters
{
  internal static void Register(GridExportWriterRegistry registry)
  {
    registry.Register(new CsvWriter());
    registry.Register(new XlsxWriter());
  }

  private sealed class CsvWriter : IGridExportWriter
  {
    public string Format => GridExportFormats.Csv;

    public string ContentType => "text/csv";

    public string FileExtension => "csv";

    public Task<GridExportResult> WriteAsync<T>(
      IQueryable<T> source,
      GridExportRequest request,
      Stream output,
      GridExportContext context,
      CancellationToken cancellationToken)
      => GridExportRunner.RunAsync(
        source,
        request,
        output,
        context,
        static (plan, columns, stream, options, ctx, ct) => CsvGridExporter.WriteAsync(
          ctx.StreamAsync(plan.ExportQuery, ct),
          columns,
          plan.ExportFields,
          stream,
          options,
          ct),
        cancellationToken);
  }

  private sealed class XlsxWriter : IGridExportWriter
  {
    public string Format => GridExportFormats.Xlsx;

    public string ContentType => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    public string FileExtension => "xlsx";

    public Task<GridExportResult> WriteAsync<T>(
      IQueryable<T> source,
      GridExportRequest request,
      Stream output,
      GridExportContext context,
      CancellationToken cancellationToken)
      => GridExportRunner.RunAsync(
        source,
        request,
        output,
        context,
        async (plan, columns, stream, options, ctx, ct) =>
        {
          var items = await MaterializeAsync(ctx.StreamAsync(plan.ExportQuery, ct), ct);
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
}
