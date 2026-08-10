# Publishing

> Scope: versioning and releasing `DataGrid.*` NuGet packages and `@laczynski/datagrid*` npm packages.

## Registries

| Package                        | Primary registry                   | Secondary (NuGet only) |
| ------------------------------ | ---------------------------------- | ---------------------- |
| `DataGrid.Abstractions`        | [nuget.org](https://www.nuget.org) | GitHub Packages        |
| `DataGrid.Core`                | [nuget.org](https://www.nuget.org) | GitHub Packages        |
| `DataGrid.EntityFrameworkCore` | [nuget.org](https://www.nuget.org) | GitHub Packages        |
| `@laczynski/datagrid`          | [npmjs.com](https://www.npmjs.com) | —                      |
| `@laczynski/datagrid-primeng`  | [npmjs.com](https://www.npmjs.com) | —                      |
| `@laczynski/datagrid-ui`       | [npmjs.com](https://www.npmjs.com) | —                      |
| `@laczynski/datagrid-spartan`  | [npmjs.com](https://www.npmjs.com) | —                      |
| `@laczynski/datagrid-cli`      | [npmjs.com](https://www.npmjs.com) | —                      |

All packages publish on tag push `v*` via [publish.yml](../../.github/workflows/publish.yml) (trusted publishing / OIDC).

NuGet `RepositoryUrl` links packages to this repo on first GitHub Packages publish.

## Where versions live

| Stack                  | Location                                                          |
| ---------------------- | ----------------------------------------------------------------- |
| NuGet (shared)         | `src/dotnet/Directory.Build.props` → `<Version>`                  |
| npm per package        | `src/npm/packages/*/package.json` → `"version"`                   |
| primeng / ui / spartan | `peerDependencies["@laczynski/datagrid"]` must match core version |
| cli                    | no `@laczynski/datagrid` peer — schematics only                   |

## Release checklist

1. Bump versions in `Directory.Build.props` and npm `package.json` files.
2. Update `CHANGELOG.md`.
3. Verify locally:

   ```powershell
   npm run test:all
   npm run build:all
   npm run lint:frontend
   npm run pack:backend
   npm run pack:npm
   ```

4. Tag and push:

   ```powershell
   git tag v0.1.0-preview.13
   git push origin v0.1.0-preview.13
   ```

   [publish.yml](../../.github/workflows/publish.yml) runs tests, then publishes NuGet (nuget.org + GitHub Packages), npm (npmjs.com), and creates a GitHub Release from `CHANGELOG.md`.

## One-time setup

### GitHub secret

Settings → Secrets and variables → Actions:

| Secret       | Value                              |
| ------------ | ---------------------------------- |
| `NUGET_USER` | nuget.org profile name (not email) |

### nuget.org trusted publishing

1. [nuget.org](https://www.nuget.org) → profile → **Trusted Publishing** → **Add**.
2. Policy fields:

   | Field            | Value                  |
   | ---------------- | ---------------------- |
   | Package Owner    | your nuget.org account |
   | Repository Owner | `laczynski`            |
   | Repository       | `DataGrid`             |
   | Workflow File    | `publish.yml`          |
   | Environment      | _(leave empty)_        |

### npm trusted publishing

For each package (`@laczynski/datagrid`, `@laczynski/datagrid-primeng`, `@laczynski/datagrid-ui`, `@laczynski/datagrid-spartan`, `@laczynski/datagrid-cli`):

npmjs.com → package → **Settings** → **Trusted Publisher** → **GitHub Actions**:

| Field                | Value           |
| -------------------- | --------------- |
| Organization or user | `laczynski`     |
| Repository           | `DataGrid`      |
| Workflow filename    | `publish.yml`   |
| Environment          | _(leave empty)_ |

No `NPM_TOKEN` secret — CI uses OIDC (npm CLI ≥ 11.5.1, upgraded in the workflow).

**New packages** (`@laczynski/datagrid-spartan`, `@laczynski/datagrid-cli`): create each package on npmjs.com (or let the first trusted publish create it), then add the trusted publisher **before** tagging a release that includes them.

### GitHub repository settings

Actions enabled; workflow permissions allow `packages: write` and OIDC (`id-token: write` is set in the workflow).

## Publish workflow (tag `v*`)

[`.github/workflows/publish.yml`](../../.github/workflows/publish.yml):

1. Test + lint
2. Pack NuGet + npm
3. Publish NuGet to **nuget.org** and **GitHub Packages** (OIDC + `GITHUB_TOKEN`)
4. Publish npm to **npmjs.com** with `--provenance` (OIDC)
5. Create GitHub Release from `CHANGELOG.md`

Prerelease tags (`v*-*`) publish npm with dist-tag `preview`; stable tags use `latest`.

## Consumer setup

### NuGet (nuget.org)

```powershell
dotnet add package DataGrid.EntityFrameworkCore --version 0.1.0-preview.13
```

### NuGet (GitHub Packages)

Copy [`nuget.config.example`](nuget.config.example). Replace `OWNER` with `laczynski`.

```powershell
dotnet nuget add source --username YOUR_GITHUB_USERNAME --password YOUR_PAT --store-password-in-clear-text --name github "https://nuget.pkg.github.com/OWNER/index.json"
dotnet add package DataGrid.EntityFrameworkCore --version 0.1.0-preview.12
```

In GitHub Actions on a consuming repo, use `GITHUB_TOKEN` with read access to the package.

### npm (npmjs.com)

Public packages — no special `.npmrc` required:

```powershell
npm install @laczynski/datagrid@preview @laczynski/datagrid-primeng@preview @laczynski/datagrid-ui@preview @laczynski/datagrid-spartan@preview
npm install -D @laczynski/datagrid-cli@preview
```

**Spartan L1** — `@laczynski/datagrid-spartan` only (built-in `dg-sh-*` helm).

**Spartan L3** — add `@laczynski/datagrid-cli`, install Spartan helm in the app, then:

```powershell
ng generate @laczynski/datagrid-cli:spartan-grid --level=full
```

See [spartan-l3-hlm.md](../guides/spartan-l3-hlm.md).

### App integration

See [getting-started.md](../getting-started.md).

## Optional: local NuGet.org push (API key)

Trusted publishing works in CI only. For a local push without OIDC:

```powershell
$apiKey = "<nuget.org-api-key>"
dotnet nuget push artifacts/nuget/DataGrid.EntityFrameworkCore.*.nupkg --api-key $apiKey --source https://api.nuget.org/v3/index.json
```
