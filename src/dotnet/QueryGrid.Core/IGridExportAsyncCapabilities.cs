using QueryGrid.Abstractions;

namespace QueryGrid.Core;

/// <summary>
/// Provider-specific async operations used by <see cref="IGridExportWriter.WriteAsync"/>.
/// Entity Framework Core supplies a streaming implementation; in-memory sources use a synchronous fallback.
/// </summary>
public interface IGridExportAsyncCapabilities
{
  /// <summary>Counts rows matching the query without materializing the full result set when possible.</summary>
  Task<int> CountAsync<T>(IQueryable<T> query, CancellationToken cancellationToken);

  /// <summary>Streams query rows asynchronously when supported by the underlying provider.</summary>
  IAsyncEnumerable<T> StreamAsync<T>(IQueryable<T> query, CancellationToken cancellationToken);
}
