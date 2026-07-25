namespace QueryGrid.Core;

/// <summary>Resolves export metadata from the writer registry.</summary>
public static class GridExportMetadata
{
  /// <summary>Returns the HTTP <c>Content-Type</c> for a registered <paramref name="format"/>.</summary>
  public static string GetContentType(string format, GridExportWriterRegistry? registry = null)
    => ResolveWriter(format, registry).ContentType;

  /// <summary>Returns the file extension without a leading dot for a registered <paramref name="format"/>.</summary>
  public static string GetFileExtension(string format, GridExportWriterRegistry? registry = null)
    => ResolveWriter(format, registry).FileExtension;

  /// <summary>
  /// Builds a download filename from <paramref name="baseName"/> and a registered <paramref name="format"/>.
  /// </summary>
  public static string GetFilename(string baseName, string format, GridExportWriterRegistry? registry = null)
    => Abstractions.GridExportContentTypes.GetFilename(baseName, GetFileExtension(format, registry));

  private static IGridExportWriter ResolveWriter(string format, GridExportWriterRegistry? registry)
    => (registry ?? GridExportWriterRegistry.Default).GetRequired(format);
}
