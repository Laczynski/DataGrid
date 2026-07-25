using QueryGrid.Abstractions;
using QueryGrid.Core;

namespace QueryGrid.UnitTests;

public class GridExportMetadataTests
{
  [Fact]
  public void Metadata_resolves_from_default_registry()
  {
    Assert.Equal("text/csv", GridExportMetadata.GetContentType(GridExportFormats.Csv));
    Assert.Equal("csv", GridExportMetadata.GetFileExtension(GridExportFormats.Csv));
    Assert.Equal("issues.csv", GridExportMetadata.GetFilename("issues", GridExportFormats.Csv));
  }

  [Fact]
  public void Custom_writer_metadata_resolves_from_custom_registry()
  {
    var registry = new GridExportWriterRegistry();
    registry.Register(new TestWriter("pdf", "application/pdf", "pdf"));

    Assert.Equal("application/pdf", GridExportMetadata.GetContentType("pdf", registry));
    Assert.Equal("issues.pdf", GridExportMetadata.GetFilename("issues", "pdf", registry));
  }

  private sealed class TestWriter(string format, string contentType, string fileExtension) : IGridExportWriter
  {
    public string Format => format;
    public string ContentType => contentType;
    public string FileExtension => fileExtension;

    public GridExportResult Write<T>(
      IQueryable<T> source,
      GridExportRequest request,
      Stream output,
      GridOptions? gridOptions,
      GridExportOptions? exportOptions)
      => throw new NotSupportedException();

    public Task<GridExportResult> WriteAsync<T>(
      IQueryable<T> source,
      GridExportRequest request,
      Stream output,
      IGridExportAsyncCapabilities capabilities,
      GridOptions? gridOptions,
      GridExportOptions? exportOptions,
      CancellationToken cancellationToken)
      => throw new NotSupportedException();
  }
}
