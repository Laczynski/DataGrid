namespace QueryGrid.Core;

/// <summary>Startup registration helpers for <see cref="GridExportWriterRegistry"/>.</summary>
public static class GridExportWriterRegistration
{
  /// <summary>Registers custom writers on <see cref="GridExportWriterRegistry.Default"/> at application startup.</summary>
  public static void Configure(Action<GridExportWriterRegistry> configure)
  {
    ArgumentNullException.ThrowIfNull(configure);
    configure(GridExportWriterRegistry.Default);
  }
}
