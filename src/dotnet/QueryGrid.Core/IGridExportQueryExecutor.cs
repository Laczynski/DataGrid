namespace QueryGrid.Core;

/// <summary>Provider-specific counting and streaming used during export.</summary>
public interface IGridExportQueryExecutor
{
  /// <summary>Counts rows matching the query.</summary>
  Task<int> CountAsync<T>(IQueryable<T> query, CancellationToken cancellationToken);

  /// <summary>Streams query rows asynchronously when supported by the underlying provider.</summary>
  IAsyncEnumerable<T> StreamAsync<T>(IQueryable<T> query, CancellationToken cancellationToken);
}
