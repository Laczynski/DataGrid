namespace QueryGrid.Core;

/// <summary>
/// Configuration for grid export: row caps, format-specific settings, and optional value formatting.
/// Separate from <see cref="GridOptions"/> list paging limits.
/// </summary>
public sealed class GridExportOptions
{
  /// <summary>The shared default instance used when no options are supplied.</summary>
  public static GridExportOptions Default { get; } = new();

  /// <summary>Maximum number of rows written to a single export file. Default 50_000.</summary>
  public int MaxExportRows { get; set; } = 50_000;

  /// <summary>Maximum number of keys allowed in a selected-keys export. Default 10_000.</summary>
  public int MaxSelectedKeys { get; set; } = 10_000;

  /// <summary>When <see langword="true"/>, writes a header row from column labels. Default <see langword="true"/>.</summary>
  public bool IncludeHeaders { get; set; } = true;

  /// <summary>CSV output settings.</summary>
  public CsvGridExportOptions Csv { get; set; } = new();

  /// <summary>Excel output settings.</summary>
  public XlsxGridExportOptions Xlsx { get; set; } = new();

  /// <summary>Optional transform applied to each cell value before formatting.</summary>
  public GridExportValueFormatter? ValueFormatter { get; set; }

  /// <summary>
  /// Optional writer registry. When <see langword="null"/>, <see cref="GridExportWriterRegistry.Default"/> is used.
  /// </summary>
  public GridExportWriterRegistry? Writers { get; set; }
}
