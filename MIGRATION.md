# Migration Guide: From pnpm to Bun

This guide helps you migrate an existing pnpm-based Effect monorepo to use Bun.

## Prerequisites

Make sure you have Bun installed:

```sh
curl -fsSL https://bun.sh/install | bash
```

Or on Windows:

```sh
powershell -c "irm bun.sh/install.ps1 | iex"
```

## Step 1: Remove pnpm Files

```sh
rm pnpm-lock.yaml
rm pnpm-workspace.yaml
```

## Step 2: Update package.json

### Root package.json changes:

1. Change `packageManager` from `pnpm@x.x.x` to `bun@1.1.34` (or latest)
2. Update all `pnpm` commands in scripts to use `bun run`
3. Replace `pnpm --recursive` with `bun run --filter='*'`
4. Remove `tsx` dependency from devDependencies
5. Replace `pnpm` section with `bun` section (if needed)
6. Move `overrides` to root level (no longer nested under `pnpm`)

### Package-level package.json changes:

Update all packages to replace `pnpm` with `bun run` in their build scripts.

## Step 3: Create bunfig.toml

Create a `bunfig.toml` file in your project root with workspace configuration.

## Step 4: Update CI/CD

### GitHub Actions:

1. Replace `pnpm/action-setup@v3` with `oven-sh/setup-bun@v1`
2. Remove `cache: pnpm` from Node.js setup
3. Replace all `pnpm` commands with `bun` or `bun run`
4. Update `pnpx` to `bunx` where applicable

### Other CI systems:

- Install Bun instead of pnpm
- Replace package manager commands accordingly

## Step 5: Install Dependencies

```sh
bun install
```

This will create a new `bun.lockb` file.

## Step 6: Update Scripts and Documentation

1. Update README.md to mention Bun instead of tsx/pnpm
2. Update any scripts or documentation that reference pnpm commands
3. Replace `pnpm tsx` with `bun run` or just `bun` for TypeScript execution

## Key Differences

### Dependency Installation
- **Before**: `pnpm install`
- **After**: `bun install`

### Running TypeScript Files
- **Before**: `pnpm tsx ./file.ts`
- **After**: `bun ./file.ts` or `bun run ./file.ts`

### Workspace Commands
- **Before**: `pnpm --recursive run build`
- **After**: `bun run --filter='*' build`

### Package Execution
- **Before**: `pnpx some-package`
- **After**: `bunx some-package`

## Benefits After Migration

1. **Faster installs**: Bun is significantly faster than pnpm
2. **Native TypeScript**: No need for tsx or ts-node
3. **Built-in bundling**: Can use Bun's bundler when needed
4. **Single runtime**: Bun handles package management, execution, and bundling

## Troubleshooting

### Dependency Issues
If you encounter dependency resolution issues, try:
```sh
rm -rf node_modules bun.lockb
bun install
```

### Workspace Issues
Make sure your `bunfig.toml` has workspaces enabled and packages are properly configured.

### Build Issues
The TypeScript compilation process for library builds remains the same - only the execution of the build commands changes from pnpm to bun.

## Verification

After migration, verify everything works:

```sh
bun run check
bun run lint
bun run build
bun test
```

All commands should work as before, but faster!