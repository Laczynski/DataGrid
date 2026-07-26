using QueryGrid.Abstractions;
using QueryGrid.Core;

namespace QueryGrid.UnitTests;

public class GridExportContentTypesTests
{
  [Theory]
  [InlineData("issues", "csv", "issues.csv")]
  [InlineData("issues.csv", "csv", "issues.csv")]
  [InlineData("issues", "xlsx", "issues.xlsx")]
  [InlineData("issues.xlsx", "xlsx", "issues.xlsx")]
  public void GetFilename_appends_extension_when_missing(string baseName, string extension, string expected)
    => Assert.Equal(expected, GridExportContentTypes.GetFilename(baseName, extension));
}
