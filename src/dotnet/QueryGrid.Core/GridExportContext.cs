namespace QueryGrid.Core;

/// <summary>Execution context used by <see cref="IGridExportWriter"/> implementations.</summary>
public sealed class GridExportContext
{
  private readonly IGridExportQueryExecutor _executor;

  private GridExportContext(GridOptions gridOptions, GridExportOptions exportOptions, IGridExportQueryExecutor executor)
  {
    GridOptions = gridOptions;
    ExportOptions = exportOptions;
    _executor = executor;
  }

  /// <summary>Grid list options applied during export planning.</summary>
  public GridOptions GridOptions { get; }

  /// <summary>Export-specific options applied during export planning and writing.</summary>
  public GridExportOptions ExportOptions { get; }

  /// <summary>Counts rows matching the query.</summary>
  public Task<int> CountAsync<T>(IQueryable<T> query, CancellationToken cancellationToken)
    => _executor.CountAsync(query, cancellationToken);

  /// <summary>Streams query rows asynchronously when supported by the underlying provider.</summary>
  public IAsyncEnumerable<T> StreamAsync<T>(IQueryable<T> query, CancellationToken cancellationToken)
    => _executor.StreamAsync(query, cancellationToken);

  /// <summary>Creates a context backed by a custom query executor.</summary>
  public static GridExportContext Create(
    GridOptions gridOptions,
    GridExportOptions exportOptions,
    IGridExportQueryExecutor executor)
    => new(gridOptions, exportOptions, executor);

  /// <summary>Creates a context for in-memory <see cref="IQueryable{T}"/> sources.</summary>
  public static GridExportContext InMemory(GridOptions? gridOptions = null, GridExportOptions? exportOptions = null)
    => Create(
      gridOptions ?? GridOptions.Default,
      exportOptions ?? GridExportOptions.Default,
      Internal.InMemoryGridExportQueryExecutor.Instance);
}
