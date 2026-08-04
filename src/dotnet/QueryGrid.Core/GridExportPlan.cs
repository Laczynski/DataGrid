using QueryGrid.Abstractions;
using QueryGrid.Core.Schema;

namespace QueryGrid.Core;

/// <summary>Planned export query produced by <see cref="GridExportExtensions.ApplyGridExport"/>.</summary>
public readonly record struct GridExportPlan<T>(
  IQueryable<T> FilteredQuery,
  IQueryable<T> ExportQuery,
  IReadOnlyList<SortDescriptor> EffectiveSort,
  IReadOnlyList<GridFieldInfo> ExportFields);
