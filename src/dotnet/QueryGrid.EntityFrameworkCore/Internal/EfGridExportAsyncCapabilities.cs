using Microsoft.EntityFrameworkCore;
using QueryGrid.Abstractions;
using QueryGrid.Core;

namespace QueryGrid.EntityFrameworkCore.Internal;

internal sealed class EfGridExportAsyncCapabilities : IGridExportAsyncCapabilities
{
  internal static EfGridExportAsyncCapabilities Instance { get; } = new();

  public Task<int> CountAsync<T>(IQueryable<T> query, CancellationToken cancellationToken)
    => query.CountAsync(cancellationToken);

  public IAsyncEnumerable<T> StreamAsync<T>(IQueryable<T> query, CancellationToken cancellationToken)
    => query.AsAsyncEnumerable();
}
