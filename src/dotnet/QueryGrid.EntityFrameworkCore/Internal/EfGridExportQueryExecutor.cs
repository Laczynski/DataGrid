using Microsoft.EntityFrameworkCore;
using QueryGrid.Core;

namespace QueryGrid.EntityFrameworkCore.Internal;

internal sealed class EfGridExportQueryExecutor : IGridExportQueryExecutor
{
  internal static EfGridExportQueryExecutor Instance { get; } = new();

  public Task<int> CountAsync<T>(IQueryable<T> query, CancellationToken cancellationToken)
    => query.CountAsync(cancellationToken);

  public IAsyncEnumerable<T> StreamAsync<T>(IQueryable<T> query, CancellationToken cancellationToken)
    => query.AsAsyncEnumerable();
}
