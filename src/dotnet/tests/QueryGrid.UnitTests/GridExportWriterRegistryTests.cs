using QueryGrid.Abstractions;
using QueryGrid.Core;

namespace QueryGrid.UnitTests;

public class GridExportWriterRegistryTests
{
  [Fact]
  public void Registry_resolves_builtin_metadata()
  {
    var registry = GridExportWriterRegistry.Default;

    Assert.Equal("text/csv", registry.GetContentType(GridExportFormats.Csv));
    Assert.Equal("csv", registry.GetFileExtension(GridExportFormats.Csv));
    Assert.Equal("issues.csv", registry.GetFilename("issues", GridExportFormats.Csv));
  }

  [Fact]
  public void Custom_writer_metadata_resolves_from_custom_registry()
  {
    var registry = new GridExportWriterRegistry();
    registry.Register(new TestWriter("pdf", "application/pdf", "pdf"));

    Assert.Equal("application/pdf", registry.GetContentType("pdf"));
    Assert.Equal("issues.pdf", registry.GetFilename("issues", "pdf"));
  }

  private sealed class TestWriter(string format, string contentType, string fileExtension) : IGridExportWriter
  {
    public string Format => format;
    public string ContentType => contentType;
    public string FileExtension => fileExtension;

    public Task<GridExportResult> WriteAsync<T>(
      IQueryable<T> source,
      GridExportRequest request,
      Stream output,
      GridExportContext context,
      CancellationToken cancellationToken)
      => throw new NotSupportedException();
  }
}
