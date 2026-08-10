namespace DataGrid.Core;

/// <summary>Metadata for a format registered in <see cref="GridExportWriterRegistry"/>.</summary>
public sealed record GridExportFormatDescriptor(string Format, string ContentType, string FileExtension);
