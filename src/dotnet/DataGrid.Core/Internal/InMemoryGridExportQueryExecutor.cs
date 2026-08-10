namespace DataGrid.Core.Internal;

internal sealed class InMemoryGridExportQueryExecutor : IGridExportQueryExecutor
{
  internal static InMemoryGridExportQueryExecutor Instance { get; } = new();

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
