# Embed SDK's monorepo

Built on top of [Effect](https://effect.website/)

## Publishing

**To release packages:**

1. **Create changeset:** `bunx changeset` (select packages, describe changes)
2. **Commit & push:** `git add . && git commit -m "add changeset" && git push`
3. **Merge to master:** Create PR, merge to `master`
4. **Auto-publish:** GitHub Actions will create release PR, merge it to publish

**Manual publish (if needed):**
```sh
bun run build
bunx changeset publish
```

## Getting Started

This template uses [Bun](https://bun.sh) as the package manager and runtime, which provides native TypeScript support without requiring additional transpilation for development.

### Installation

Install dependencies using Bun:

```sh
bun install
```

### Running TypeScript Files

Execute TypeScript files directly with Bun (no compilation needed):

```sh
bun run ./path/to/the/file.ts
```

Or simply:

```sh
bun ./path/to/the/file.ts
```

### Running Scripts

Execute any script from the workspace root:

```sh
bun run <script-name>
```

Or run scripts in specific packages:

```sh
bun run --filter="@template/cli" <script-name>
```

## Development Operations

**Code Generation**

Generate code for all packages:

```sh
bun run codegen
```

**Type Checking**

Check types across all packages:

```sh
bun run check
```

**Linting**

Lint the codebase:

```sh
bun run lint
```

Fix linting issues automatically:

```sh
bun run lint-fix
```

**Building**

Build all packages for distribution (generates type definitions and multiple module formats):

```sh
bun run build
```

**Testing**

Run tests across all packages:

```sh
bun test
```

Run tests with coverage:

```sh
bun run coverage
```

## Troubleshooting

### Build Failures with Missing TypeScript Configuration Files

**Error Messages:**

```
error TS5083: Cannot read file '/Users/samuel/git/embed/packages/cli/tsconfig.build.json'.
error TS5083: Cannot read file '/Users/samuel/git/embed/packages/core/tsconfig.build.json'.
error TS5083: Cannot read file '/Users/samuel/git/embed/packages/react/tsconfig.build.json'.
error TS5083: Cannot read file '/Users/samuel/git/embed/packages/server/tsconfig.build.json'.
```

**Root Cause:**
The root `tsconfig.build.json` was referencing packages that don't exist in the current workspace structure.

**Solution:**

1. Update the root `tsconfig.build.json` to only reference existing packages:
   ```json
   {
     "extends": "./tsconfig.base.json",
     "include": [],
     "references": [{ "path": "packages/embed-typescript/tsconfig.build.json" }]
   }
   ```
   Be aware, you may have created more ;)

### Workspace Filter Not Working

**Error Messages:**

```
error: No packages matched the filter
error: script "build" exited with code 1
```

**Root Cause:**

- Incorrect bun workspace filter syntax
- Stale workspace cache with references to old packages

**Solution:**

1. **Fix the workspace filter syntax** - Change from:

   ```bash
   bun --filter '*' run build
   ```

   To:

   ```bash
   bun run --filter='*' build
   ```

2. **Clear stale workspace cache:**

   ```bash
   rm -rf node_modules bun.lock
   bun install
   ```

3. **Update package.json scripts** to use correct syntax:
   ```json
   {
     "scripts": {
       "codegen": "bun run --filter='*' codegen",
       "build": "bun run build:types && bun run --filter='*' build",
       "check-recursive": "bun run --filter='*' check"
     }
   }
   ```

### Adding New Packages to the Workspace

When adding new packages, ensure they:

1. Have a `package.json` with appropriate scripts (`build`, `codegen`, `check`, etc.)
2. Include proper TypeScript configuration files if using TypeScript
3. Are added to the root `tsconfig.build.json` references array if they need TypeScript compilation
