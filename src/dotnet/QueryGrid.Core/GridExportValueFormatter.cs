using QueryGrid.Core.Schema;

namespace QueryGrid.Core;

/// <summary>
/// Optional hook to transform a cell value before it is written to an export file.
/// </summary>
/// <param name="value">The raw property value from the row.</param>
/// <param name="field">Schema metadata for the exported column.</param>
public delegate object? GridExportValueFormatter(object? value, GridFieldInfo field);
