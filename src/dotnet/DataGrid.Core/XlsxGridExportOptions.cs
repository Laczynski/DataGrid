namespace DataGrid.Core;

/// <summary>Excel-specific export settings.</summary>
public sealed class XlsxGridExportOptions
{
  /// <summary>Name of the worksheet that receives exported rows. Default <c>Export</c>.</summary>
  public string WorksheetName { get; set; } = "Export";
}
