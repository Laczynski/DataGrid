# DataGrid.Abstractions

Transport contracts for [DataGrid](https://github.com/laczynski/DataGrid): `GridQuery`, `GridResult`, filter/sort types, DTO attributes, and JSON serialization helpers. Zero dependencies.

## Install

```powershell
dotnet add package Laczynski.DataGrid.Abstractions
```

Most apps reference `Laczynski.DataGrid.EntityFrameworkCore` instead, which pulls this package in transitively.

## Example

```csharp
using DataGrid.Abstractions.Serialization;

var options = GridQueryJson.CreateOptions();
var query = JsonSerializer.Deserialize<GridQuery>(json, options);
```

## Full guide

[Getting started](https://github.com/laczynski/DataGrid/blob/main/docs/getting-started.md)
