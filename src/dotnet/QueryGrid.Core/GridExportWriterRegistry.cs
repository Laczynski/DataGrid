using System.Collections.Concurrent;
using QueryGrid.Abstractions;
using QueryGrid.Core.Internal;

namespace QueryGrid.Core;

/// <summary>
/// Registry of grid export writers. Built-in CSV and Excel writers are registered on <see cref="Default"/>.
/// </summary>
public sealed class GridExportWriterRegistry
{
  private readonly ConcurrentDictionary<string, IGridExportWriter> _writers = new(StringComparer.OrdinalIgnoreCase);

  /// <summary>The shared registry used by export entry points unless overridden in <see cref="GridExportOptions.Writers"/>.</summary>
  public static GridExportWriterRegistry Default { get; } = new();

  static GridExportWriterRegistry()
    => BuiltInGridExportWriters.Register(Default);

  /// <summary>Registers or replaces a writer for <see cref="IGridExportWriter.Format"/>.</summary>
  public void Register(IGridExportWriter writer)
  {
    ArgumentNullException.ThrowIfNull(writer);
    ArgumentException.ThrowIfNullOrWhiteSpace(writer.Format);
    _writers[writer.Format] = writer;
  }

  /// <summary>Returns a registered writer for <paramref name="format"/>, or <see langword="null"/>.</summary>
  public IGridExportWriter? TryGet(string format)
    => string.IsNullOrWhiteSpace(format) ? null : _writers.TryGetValue(format, out var writer) ? writer : null;

  /// <summary>Returns a registered writer or throws <see cref="GridValidationException"/>.</summary>
  public IGridExportWriter GetRequired(string format)
  {
    var writer = TryGet(format);
    if (writer is null)
    {
      throw new GridValidationException(
        GridValidationCodes.ExportFormatNotSupported,
        $"Export format '{format}' is not supported.");
    }

    return writer;
  }

  /// <summary>Returns the HTTP <c>Content-Type</c> for a registered <paramref name="format"/>.</summary>
  public string GetContentType(string format) => GetRequired(format).ContentType;

  /// <summary>Returns the file extension without a leading dot for a registered <paramref name="format"/>.</summary>
  public string GetFileExtension(string format) => GetRequired(format).FileExtension;

  /// <summary>Builds a download filename from <paramref name="baseName"/> and a registered <paramref name="format"/>.</summary>
  public string GetFilename(string baseName, string format)
    => GridExportContentTypes.GetFilename(baseName, GetFileExtension(format));
}
