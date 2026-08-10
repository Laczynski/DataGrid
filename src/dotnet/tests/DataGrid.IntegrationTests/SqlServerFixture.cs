using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using DataGrid.Abstractions;
using DataGrid.EntityFrameworkCore;
using Testcontainers.MsSql;

namespace DataGrid.IntegrationTests;

public sealed class SqlServerFixture : IAsyncLifetime
{
  private const string DatabaseName = "DataGridTests";

  private readonly MsSqlContainer _container = new MsSqlBuilder()
    .WithImage("mcr.microsoft.com/mssql/server:2022-latest")
    .Build();

  public string ConnectionString { get; private set; } = string.Empty;

  public async ValueTask InitializeAsync()
  {
    await _container.StartAsync(TestContext.Current.CancellationToken);

    var builder = new SqlConnectionStringBuilder(_container.GetConnectionString())
    {
      InitialCatalog = DatabaseName,
    };
    ConnectionString = builder.ConnectionString;

    var options = new DbContextOptionsBuilder<SearchTestDbContext>()
      .UseSqlServer(ConnectionString)
      .Options;

    await using var context = new SearchTestDbContext(options);
    await context.Database.EnsureDeletedAsync(TestContext.Current.CancellationToken);
    await context.Database.EnsureCreatedAsync(TestContext.Current.CancellationToken);
  }

  public async ValueTask DisposeAsync()
  {
    await _container.DisposeAsync();
  }
}

[CollectionDefinition(nameof(SqlServerCollection))]
public sealed class SqlServerCollection : ICollectionFixture<SqlServerFixture>;

[Collection(nameof(SqlServerCollection))]
public abstract class SqlServerTestBase(SqlServerFixture fixture)
{
  protected async Task<SearchTestDbContext> CreateSeededContextAsync()
  {
    var options = new DbContextOptionsBuilder<SearchTestDbContext>()
      .UseSqlServer(fixture.ConnectionString)
      .Options;

    var context = new SearchTestDbContext(options);
    await SearchTestData.SeedAsync(context);
    await SearchTestData.SeedAppointmentsAsync(context);
    return context;
  }
}
