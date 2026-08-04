namespace QueryGrid.Abstractions;

/// <summary>Well-known grid export format identifiers. Custom formats use any other non-empty string.</summary>
public static class GridExportFormats
{
  /// <summary>Comma-separated values.</summary>
  public const string Csv = "csv";

  /// <summary>Microsoft Excel Open XML workbook.</summary>
  public const string Xlsx = "xlsx";
}
