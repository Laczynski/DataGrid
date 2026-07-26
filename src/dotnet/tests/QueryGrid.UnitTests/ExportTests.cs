using System.Text;
using ClosedXML.Excel;
using Microsoft.EntityFrameworkCore;
using QueryGrid.Abstractions;
using QueryGrid.Core;
using QueryGrid.EntityFrameworkCore;
using static QueryGrid.UnitTests.TestFilters;

namespace QueryGrid.UnitTests;

public class ExportTests
{
  private sealed class TestDbContext(DbContextOptions<TestDbContext> options) : DbContext(options)
  {
    public DbSet<Person> People => Set<Person>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      modelBuilder.Entity<Person>().Ignore(p => p.Tags);
    }
  }

  private static TestDbContext NewInMemoryContext()
  {
    var options = new DbContextOptionsBuilder<TestDbContext>()
      .UseInMemoryDatabase(Guid.NewGuid().ToString())
      .Options;

    var context = new TestDbContext(options);
    context.People.AddRange(TestData.People());
    context.SaveChanges();
    return context;
  }

  private static readonly GridExportColumn[] PersonColumns =
  [
    new GridExportColumn { Field = "Id", Header = "ID" },
    new GridExportColumn { Field = "Name", Header = "Name" },
    new GridExportColumn { Field = "Email", Header = "Email" }
  ];

  private sealed class CsvRow
  {
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string? Email { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
  }

  private static GridExportRequest PersonExportRequest(GridQuery? query = null, GridExportScope scope = GridExportScope.AllMatching, params string[] selectedKeys)
    => new()
    {
      Query = query ?? new GridQuery(),
      Scope = scope,
      SelectedKeys = selectedKeys.Length > 0 ? selectedKeys : null,
      Columns = PersonColumns
    };

  private static string ExportCsv<T>(
    IQueryable<T> source,
    GridExportRequest request,
    GridExportOptions? exportOptions = null)
  {
    using var stream = new MemoryStream();
    source.ExportToCsv(
      request,
      stream,
      exportOptions: exportOptions ?? new GridExportOptions { Csv = { IncludeUtf8Bom = false } });
    return Encoding.UTF8.GetString(stream.ToArray());
  }

  [Fact]
  public void ExportToCsv_quotes_custom_delimiter_in_values()
  {
    var rows = new[]
    {
      new CsvRow { Id = 1, Name = "a;b", Email = "plain" }
    }.AsQueryable();

    var csv = ExportCsv(
      rows,
      new GridExportRequest
      {
        Columns =
        [
          new GridExportColumn { Field = "Id", Header = "ID" },
          new GridExportColumn { Field = "Name", Header = "Name" },
          new GridExportColumn { Field = "Email", Header = "Email" }
        ]
      },
      exportOptions: new GridExportOptions { Csv = { Delimiter = ";", IncludeUtf8Bom = false } });

    Assert.Contains("1;\"a;b\";plain", csv, StringComparison.Ordinal);
  }

  [Fact]
  public void ExportToCsv_quotes_commas_quotes_and_newlines()
  {
    var rows = new[]
    {
      new CsvRow { Id = 1, Name = "a,b", Email = "say \"hi\"" },
      new CsvRow { Id = 2, Name = "line1\nline2", Email = "plain" }
    }.AsQueryable();

    var csv = ExportCsv(rows, new GridExportRequest
    {
      Columns =
      [
        new GridExportColumn { Field = "Id", Header = "ID" },
        new GridExportColumn { Field = "Name", Header = "Name" },
        new GridExportColumn { Field = "Email", Header = "Email" }
      ]
    });

    Assert.Contains("1,\"a,b\",\"say \"\"hi\"\"\"", csv, StringComparison.Ordinal);
    Assert.Contains("2,\"line1\nline2\",plain", csv, StringComparison.Ordinal);
  }

  [Fact]
  public void ExportToCsv_formats_common_types()
  {
    var rows = new[]
    {
      new CsvRow
      {
        Id = 1,
        Name = "typed",
        IsActive = true,
        CreatedAt = new DateTime(2024, 1, 1)
      }
    }.AsQueryable();

    var csv = ExportCsv(rows, new GridExportRequest
    {
      Columns =
      [
        new GridExportColumn { Field = "Name", Header = "Name" },
        new GridExportColumn { Field = "IsActive", Header = "Active" },
        new GridExportColumn { Field = "CreatedAt", Header = "Created" }
      ]
    });

    Assert.Contains("typed,true,2024-01-01T00:00:00.0000000", csv, StringComparison.Ordinal);
  }

  [Fact]
  public void ExportToCsv_writes_header_and_filtered_rows()
  {
    var request = PersonExportRequest(new GridQuery
    {
      Filter = Cond("Age", FilterOperator.Gte, 30),
      Sort = [new SortDescriptor("Age", desc: true)]
    });

    using var stream = new MemoryStream();
    var result = TestData.Query().ExportToCsv(request, stream, exportOptions: new GridExportOptions { Csv = { IncludeUtf8Bom = false } });

    var csv = Encoding.UTF8.GetString(stream.ToArray());
    Assert.Equal(3, result.TotalMatchingCount);
    Assert.Equal(3, result.ExportedRowCount);
    Assert.False(result.Truncated);
    Assert.StartsWith("ID,Name,Email", csv, StringComparison.Ordinal);
    Assert.Contains("2,Bob,bob@test.com", csv, StringComparison.Ordinal);
    Assert.Contains("1,Alice,alice@example.com", csv, StringComparison.Ordinal);
    Assert.DoesNotContain("Charlie", csv, StringComparison.Ordinal);
  }

  [Fact]
  public void ExportToCsv_selected_keys_exports_only_matching_rows()
  {
    var request = PersonExportRequest(scope: GridExportScope.SelectedKeys, selectedKeys: ["1", "3"]);

    using var stream = new MemoryStream();
    var result = TestData.Query().ExportToCsv(request, stream, exportOptions: new GridExportOptions { Csv = { IncludeUtf8Bom = false } });

    var csv = Encoding.UTF8.GetString(stream.ToArray());
    Assert.Equal(2, result.TotalMatchingCount);
    Assert.Equal(2, result.ExportedRowCount);
    Assert.Contains("1,Alice,alice@example.com", csv, StringComparison.Ordinal);
    Assert.Contains("3,Charlie,", csv, StringComparison.Ordinal);
    Assert.DoesNotContain("Bob", csv, StringComparison.Ordinal);
  }

  [Fact]
  public void ExportToCsv_truncates_when_over_max_export_rows()
  {
    var request = PersonExportRequest();
    var options = new GridExportOptions { MaxExportRows = 2, Csv = { IncludeUtf8Bom = false } };

    using var stream = new MemoryStream();
    var result = TestData.Query().ExportToCsv(request, stream, exportOptions: options);

    Assert.Equal(4, result.TotalMatchingCount);
    Assert.Equal(2, result.ExportedRowCount);
    Assert.True(result.Truncated);
  }

  [Fact]
  public void ExportToCsv_requires_columns()
  {
    var request = new GridExportRequest { Query = new GridQuery(), Columns = [] };

    var ex = Assert.Throws<GridValidationException>(() =>
    {
      using var stream = new MemoryStream();
      TestData.Query().ExportToCsv(request, stream);
    });

    Assert.Equal(GridValidationCodes.ExportColumnsRequired, ex.Code);
  }

  [Fact]
  public void ExportToCsv_selected_scope_requires_keys()
  {
    var request = new GridExportRequest
    {
      Query = new GridQuery(),
      Scope = GridExportScope.SelectedKeys,
      Columns = PersonColumns
    };

    var ex = Assert.Throws<GridValidationException>(() =>
    {
      using var stream = new MemoryStream();
      TestData.Query().ExportToCsv(request, stream);
    });

    Assert.Equal(GridValidationCodes.ExportSelectionRequired, ex.Code);
  }

  [Fact]
  public void ExportToXlsx_writes_workbook_with_headers_and_rows()
  {
    var request = new GridExportRequest
    {
      Format = GridExportFormats.Xlsx,
      Query = new GridQuery
      {
        Filter = Cond("Age", FilterOperator.Gte, 30),
        Sort = [new SortDescriptor("Age", desc: true)]
      },
      Columns = PersonColumns
    };

    using var stream = new MemoryStream();
    var result = TestData.Query().ExportToXlsx(request, stream);

    Assert.Equal(3, result.TotalMatchingCount);
    Assert.Equal(3, result.ExportedRowCount);

    using var workbook = new ClosedXML.Excel.XLWorkbook(stream);
    var worksheet = workbook.Worksheet("Export");
    Assert.Equal("ID", worksheet.Cell(1, 1).GetString());
    Assert.Equal("Bob", worksheet.Cell(2, 2).GetString());
    Assert.Equal(4, worksheet.LastRowUsed()!.RowNumber());
  }

  [Fact]
  public async Task ExportAsync_writes_csv_when_format_is_csv()
  {
    var request = PersonExportRequest();
    request.Format = GridExportFormats.Csv;

    await using var context = NewInMemoryContext();
    await using var stream = new MemoryStream();
    var exportOptions = new GridExportOptions { Csv = { IncludeUtf8Bom = false } };
    var result = await context.People.ExportAsync(
      request,
      stream,
      exportOptions: exportOptions,
      cancellationToken: TestContext.Current.CancellationToken);

    var csv = Encoding.UTF8.GetString(stream.ToArray());
    Assert.Equal(4, result.ExportedRowCount);
    Assert.StartsWith("ID,Name,Email", csv, StringComparison.Ordinal);
  }

  [Fact]
  public async Task ExportAsync_writes_xlsx_when_format_is_xlsx()
  {
    var request = PersonExportRequest();
    request.Format = GridExportFormats.Xlsx;

    await using var context = NewInMemoryContext();
    await using var stream = new MemoryStream();
    var result = await context.People.ExportAsync(
      request,
      stream,
      cancellationToken: TestContext.Current.CancellationToken);

    Assert.Equal(4, result.ExportedRowCount);

    using var workbook = new XLWorkbook(stream);
    Assert.Equal("Alice", workbook.Worksheet("Export").Cell(2, 2).GetString());
  }

  [Fact]
  public void Export_writes_csv_for_in_memory_source()
  {
    var request = PersonExportRequest();
    request.Format = GridExportFormats.Csv;

    using var stream = new MemoryStream();
    var result = TestData.Query().Export(
      request,
      stream,
      exportOptions: new GridExportOptions { Csv = { IncludeUtf8Bom = false } });

    var csv = Encoding.UTF8.GetString(stream.ToArray());
    Assert.Equal(4, result.ExportedRowCount);
    Assert.StartsWith("ID,Name,Email", csv, StringComparison.Ordinal);
  }

  [Fact]
  public void Export_dispatches_to_csv_and_xlsx()
  {
    var csvRequest = PersonExportRequest();
    csvRequest.Format = GridExportFormats.Csv;

    using var csvStream = new MemoryStream();
    var csvResult = TestData.Query().Export(csvRequest, csvStream, exportOptions: new GridExportOptions { Csv = { IncludeUtf8Bom = false } });
    Assert.Equal(4, csvResult.ExportedRowCount);

    var xlsxRequest = PersonExportRequest();
    xlsxRequest.Format = GridExportFormats.Xlsx;

    using var xlsxStream = new MemoryStream();
    var xlsxResult = TestData.Query().Export(xlsxRequest, xlsxStream);
    Assert.Equal(4, xlsxResult.ExportedRowCount);
  }

  [Fact]
  public void ExportValueFormatter_transforms_written_values()
  {
    var request = new GridExportRequest
    {
      Columns = [new GridExportColumn { Field = "Name", Header = "Name" }]
    };

    var rows = new[] { new CsvRow { Id = 1, Name = "raw" } }.AsQueryable();
    using var stream = new MemoryStream();

    rows.ExportToCsv(
      request,
      stream,
      exportOptions: new GridExportOptions
      {
        Csv = { IncludeUtf8Bom = false },
        ValueFormatter = (value, _) => $"fmt:{value}"
      });

    var csv = Encoding.UTF8.GetString(stream.ToArray());
    Assert.Contains("fmt:raw", csv, StringComparison.Ordinal);
  }

  [Fact]
  public void Export_uses_custom_writer_from_options_registry()
  {
    var registry = new GridExportWriterRegistry();
    registry.Register(new PipeDelimitedWriter());

    var request = new GridExportRequest
    {
      Format = "pipe",
      Columns =
      [
        new GridExportColumn { Field = "Id", Header = "ID" },
        new GridExportColumn { Field = "Name", Header = "Name" }
      ]
    };

    var rows = new[] { new CsvRow { Id = 1, Name = "custom" } }.AsQueryable();
    using var stream = new MemoryStream();

    var result = rows.Export(
      request,
      stream,
      exportOptions: new GridExportOptions { Writers = registry, Csv = { IncludeUtf8Bom = false } });

    var text = Encoding.UTF8.GetString(stream.ToArray());
    Assert.Equal(1, result.ExportedRowCount);
    Assert.Contains("ID|Name", text, StringComparison.Ordinal);
    Assert.Contains("1|custom", text, StringComparison.Ordinal);
  }

  private sealed class PipeDelimitedWriter : IGridExportWriter
  {
    public string Format => "pipe";
    public string ContentType => "text/plain";
    public string FileExtension => "txt";

    public Task<GridExportResult> WriteAsync<T>(
      IQueryable<T> source,
      GridExportRequest request,
      Stream output,
      GridExportContext context,
      CancellationToken cancellationToken)
      => GridExportPipeline.RunAsync(
        source,
        request,
        output,
        context,
        static async (plan, columns, stream, options, ctx, ct) =>
        {
          await using var writer = new StreamWriter(stream, leaveOpen: true);
          await writer.WriteLineAsync(string.Join('|', columns.Select(column => column.Header)).AsMemory(), ct);
          var count = 0;
          await foreach (var row in ctx.StreamAsync(plan.ExportQuery, ct))
          {
            var values = columns
              .Select(column => typeof(T).GetProperty(column.Field)!.GetValue(row)?.ToString() ?? "")
              .ToArray();
            await writer.WriteLineAsync(string.Join('|', values).AsMemory(), ct);
            count++;
          }

          await writer.FlushAsync(ct);
          return count;
        },
        cancellationToken);
  }
}
