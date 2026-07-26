namespace QueryGrid.Core;

/// <summary>CSV-specific export settings.</summary>
public sealed class CsvGridExportOptions
{
  /// <summary>When <see langword="true"/>, prepends a UTF-8 BOM so Excel on Windows opens the file correctly.</summary>
  public bool IncludeUtf8Bom { get; set; } = true;

  /// <summary>Field delimiter. Default comma.</summary>
  public string Delimiter { get; set; } = ",";
}
