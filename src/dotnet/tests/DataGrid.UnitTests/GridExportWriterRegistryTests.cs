using DataGrid.Abstractions;
using DataGrid.Core;

namespace DataGrid.UnitTests;

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

  [Fact]
  public void Registry_lists_registered_formats()
  {
    var registry = new GridExportWriterRegistry();
    registry.Register(new TestWriter("pdf", "application/pdf", "pdf"));
    registry.Register(new TestWriter("csv", "text/csv", "csv"));

    Assert.Equal(["csv", "pdf"], registry.GetRegisteredFormats());
    Assert.Equal(
      [
        new GridExportFormatDescriptor("csv", "text/csv", "csv"),
        new GridExportFormatDescriptor("pdf", "application/pdf", "pdf")
      ],
      registry.GetFormatDescriptors());
  }

  [Fact]
  public void Default_registry_includes_builtin_formats()
  {
    var formats = GridExportWriterRegistry.Default.GetRegisteredFormats();

    Assert.Contains(GridExportFormats.Csv, formats);
    Assert.Contains(GridExportFormats.Xlsx, formats);
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
