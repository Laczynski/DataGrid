namespace QueryGrid.Abstractions;

/// <summary>
/// Describes a grid export: the same filter/search/sort as the list endpoint, plus scope,
/// optional row selection, and the columns to include in the output file.
/// </summary>
public sealed class GridExportRequest
{
  /// <summary>Filter, search and sort applied before export (paging is ignored).</summary>
  public GridQuery Query { get; set; } = new();

  /// <summary>Whether to export all matching rows or only explicitly selected keys.</summary>
  public GridExportScope Scope { get; set; } = GridExportScope.AllMatching;

  /// <summary>Row keys to export when <see cref="Scope"/> is <see cref="GridExportScope.SelectedKeys"/>.</summary>
  public string[]? SelectedKeys { get; set; }

  /// <summary>Field used to match <see cref="SelectedKeys"/>. Default <c>id</c>.</summary>
  public string DataKeyField { get; set; } = "id";

  /// <summary>
  /// Output format identifier. Built-in values are <see cref="GridExportFormats.Csv"/> and
  /// <see cref="GridExportFormats.Xlsx"/>; register custom writers for other values.
  /// </summary>
  public string Format { get; set; } = GridExportFormats.Csv;

  /// <summary>Columns to write (field whitelist and header labels).</summary>
  public IList<GridExportColumn> Columns { get; set; } = new List<GridExportColumn>();
}
