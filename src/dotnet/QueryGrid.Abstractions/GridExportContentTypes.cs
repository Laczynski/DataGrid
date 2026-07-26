namespace QueryGrid.Abstractions;

/// <summary>
/// Filename helpers for grid export downloads.
/// Content type and file extension for registered formats are resolved from
/// <c>GridExportWriterRegistry</c> in <c>QueryGrid.Core</c>.
/// </summary>
public static class GridExportContentTypes
{
  /// <summary>
  /// Builds a download filename from <paramref name="baseName"/> and <paramref name="extension"/>,
  /// appending the extension when it is not already present.
  /// </summary>
  public static string GetFilename(string baseName, string extension)
  {
    ArgumentException.ThrowIfNullOrWhiteSpace(baseName);
    ArgumentException.ThrowIfNullOrWhiteSpace(extension);

    if (baseName.EndsWith($".{extension}", StringComparison.OrdinalIgnoreCase))
    {
      return baseName;
    }

    return $"{baseName}.{extension}";
  }
}
