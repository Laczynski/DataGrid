using QueryGrid.Core.Schema;

namespace QueryGrid.Core.Internal;

internal static class GridExportValues
{
  internal static object? Resolve(object? value, GridFieldInfo field, GridExportOptions options)
    => options.ValueFormatter?.Invoke(value, field) ?? value;
}
