#!/usr/bin/env bun
/* global console, process */

import { execSync } from "child_process"
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "fs"
import { join, resolve } from "path"
import { fileURLToPath } from "url"

const __dirname = resolve(fileURLToPath(import.meta.url), "..")
const rootDir = resolve(__dirname, "..")

console.log("🔧 Building React package...")

try {
  // Build React package
  execSync("bun run build:react", {
    cwd: rootDir,
    stdio: "inherit"
  })

  console.log("📦 Linking local React package to miniapp-monorepo...")

  // Paths
  const miniappDir = join(rootDir, "examples/miniapp-monorepo")
  const miniappNodeModules = join(miniappDir, "node_modules/@embed-ai")
  const builtReactDir = join(rootDir, "packages/react/dist")

  // Ensure node_modules/@embed-ai exists
  if (!existsSync(miniappNodeModules)) {
    mkdirSync(miniappNodeModules, { recursive: true })
  }

  // Remove existing react package
  const reactTarget = join(miniappNodeModules, "react")

  if (existsSync(reactTarget)) {
    rmSync(reactTarget, { recursive: true, force: true })
  }

  // Copy built React package
  cpSync(builtReactDir, reactTarget, { recursive: true })

  // Fix package.json paths to remove ./dist/ prefix
  const packageJsonPath = join(reactTarget, "package.json")
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"))

  // Update paths to remove ./dist/ prefix
  packageJson.main = "./index.js"
  packageJson.module = "./index.js"
  packageJson.types = "./index.d.ts"

  if (packageJson.exports) {
    packageJson.exports["."] = {
      types: "./index.d.ts",
      import: "./index.js"
    }
    packageJson.exports["./ui"] = {
      types: "./ui/index.d.ts",
      import: "./ui/index.js"
    }
    packageJson.exports["./feed"] = {
      types: "./feed/index.d.ts",
      import: "./feed/index.js"
    }
    packageJson.exports["./media"] = {
      types: "./media/index.d.ts",
      import: "./media/index.js"
    }
    packageJson.exports["./utils"] = {
      types: "./lib/utils.d.ts",
      import: "./lib/utils.js"
    }
  }

  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))

  console.log("✅ Local React package linked successfully!")
  console.log("💡 You can now test with: cd examples/miniapp-monorepo/packages/client && bun run dev")
  console.log("🔄 To revert: cd examples/miniapp-monorepo && bun install --force")
} catch (error) {
  console.error("❌ Error linking local React package:", error.message)
  process.exit(1)
}
