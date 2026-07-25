namespace QueryGrid.Abstractions;

/// <summary>
/// MIME types and file extensions for grid export formats.
/// Built-in formats are resolved from the writer registry in <c>QueryGrid.Core</c>;
/// pass explicit values for custom formats not registered in the current app domain.
/// </summary>
public static class GridExportContentTypes
{
  /// <summary>Returns the HTTP <c>Content-Type</c> for a built-in <paramref name="format"/>.</summary>
  public static string GetContentType(string format)
    => format switch
    {
      GridExportFormats.Xlsx => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      GridExportFormats.Csv => "text/csv",
      _ => throw new ArgumentException($"Unknown built-in export format '{format}'.", nameof(format))
    };

  /// <summary>Returns the file extension without a leading dot for a built-in <paramref name="format"/>.</summary>
  public static string GetFileExtension(string format)
    => format switch
    {
      GridExportFormats.Xlsx => "xlsx",
      GridExportFormats.Csv => "csv",
      _ => throw new ArgumentException($"Unknown built-in export format '{format}'.", nameof(format))
    };

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
