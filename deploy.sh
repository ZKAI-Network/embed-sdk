#!/bin/bash
set -euo pipefail

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"

# Paths (adjust if your structure changes)
EMBED_SRC="$PROJECT_ROOT/packages/embed-typescript"
EMBED_BUILD="$EMBED_SRC/dist"
EMBED_BUILT="$PROJECT_ROOT/packages/embed-typescript/examples/miniapp-monorepo/embed-typescript-built"
MONOREPO_MINIAPP="$PROJECT_ROOT/packages/embed-typescript/examples/miniapp-monorepo"

# Always run build and pack from inside the package directory
cd "$EMBED_SRC"
echo "==> Current directory: $(pwd)"
echo "==> EMBED_SRC: $EMBED_SRC"
ls -la
echo "==> Installing dependencies..."
bun install
echo "==> Building embed-typescript package..."
bun run build-esm
bun run build-annotate
bun run build-cjs
echo "==> Packing with build-utils..."
bunx build-utils pack-v2

cd "$PROJECT_ROOT"
ls -la "$EMBED_BUILD"

echo "==> Preparing built package for Docker context..."
rm -rf "$EMBED_BUILT"
mkdir -p "$EMBED_BUILT"
ls -la "$EMBED_BUILD"
cp -r "$EMBED_BUILD/." "$EMBED_BUILT/"
cp "$EMBED_BUILD/package.json" "$EMBED_BUILT/"
if [ -f "$EMBED_BUILD/README.md" ]; then cp "$EMBED_BUILD/README.md" "$EMBED_BUILT/"; fi
if [ -f "$EMBED_BUILD/LICENSE" ]; then cp "$EMBED_BUILD/LICENSE" "$EMBED_BUILT/"; fi

echo "==> Copying built package to monorepo workspace..."
cd "$MONOREPO_MINIAPP"
rm -rf embed-typescript
cp -r "$EMBED_BUILT" ./embed-typescript

echo "==> Updating monorepo lockfile..."
bun install

echo "==> Built package is ready at $EMBED_BUILT"
echo "==> You can now run: cd $MONOREPO_MINIAPP && fly deploy"

fly deploy

# Cleanup: Remove the copied directories after deployment
echo "==> Cleaning up copied directories..."
cd "$MONOREPO_MINIAPP"
rm -rf embed-typescript
rm -rf embed-typescript-built
echo "==> Cleanup complete - removed embed-typescript and embed-typescript-built directories"
cd "$PROJECT_ROOT"
