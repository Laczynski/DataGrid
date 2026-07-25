using QueryGrid.Abstractions;

namespace QueryGrid.Core.Internal;

internal sealed class InMemoryGridExportAsyncCapabilities : IGridExportAsyncCapabilities
{
  internal static InMemoryGridExportAsyncCapabilities Instance { get; } = new();

  public Task<int> CountAsync<T>(IQueryable<T> query, CancellationToken cancellationToken)
    => Task.FromResult(query.Count());

  public async IAsyncEnumerable<T> StreamAsync<T>(
    IQueryable<T> query,
    [System.Runtime.CompilerServices.EnumeratorCancellation] CancellationToken cancellationToken)
  {
    foreach (var item in query)
    {
      cancellationToken.ThrowIfCancellationRequested();
      yield return item;
    }

    await Task.CompletedTask;
  }
}
