using QueryGrid.Abstractions;

namespace QueryGrid.UnitTests;

public class GridExportContentTypesTests
{
  [Theory]
  [InlineData(GridExportFormats.Csv, "text/csv", "csv")]
  [InlineData(GridExportFormats.Xlsx, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "xlsx")]
  public void BuiltIn_formats_resolve_content_type_and_extension(
    string format,
    string contentType,
    string extension)
  {
    Assert.Equal(contentType, GridExportContentTypes.GetContentType(format));
    Assert.Equal(extension, GridExportContentTypes.GetFileExtension(format));
  }

  [Theory]
  [InlineData("issues", "csv", "issues.csv")]
  [InlineData("issues.csv", "csv", "issues.csv")]
  [InlineData("issues", "xlsx", "issues.xlsx")]
  [InlineData("issues.xlsx", "xlsx", "issues.xlsx")]
  public void GetFilename_appends_extension_when_missing(string baseName, string extension, string expected)
    => Assert.Equal(expected, GridExportContentTypes.GetFilename(baseName, extension));
}
