#!/usr/bin/env bun
/* global console, process */

import { execSync } from "child_process"
import { cpSync, existsSync, mkdirSync, rmSync } from "fs"
import { join, resolve } from "path"
import { fileURLToPath } from "url"

const __dirname = resolve(fileURLToPath(import.meta.url), "..")
const rootDir = resolve(__dirname, "..")

console.log("🔧 Building SDK and Types packages...")

try {
  // Build both packages from root
  execSync("bun run build", {
    cwd: rootDir,
    stdio: "inherit"
  })

  console.log("📦 Linking local SDK to simple-sdk-samples...")

  // Paths
  const samplesDir = join(rootDir, "examples/simple-sdk-samples")
  const samplesNodeModules = join(samplesDir, "node_modules/@embed-ai")
  const builtSdkDir = join(rootDir, "packages/sdk/dist")
  const builtTypesDir = join(rootDir, "packages/types/dist")

  // Ensure node_modules/@embed-ai exists
  if (!existsSync(samplesNodeModules)) {
    mkdirSync(samplesNodeModules, { recursive: true })
  }

  // Remove existing packages
  const sdkTarget = join(samplesNodeModules, "sdk")
  const typesTarget = join(samplesNodeModules, "types")

  if (existsSync(sdkTarget)) {
    rmSync(sdkTarget, { recursive: true, force: true })
  }
  if (existsSync(typesTarget)) {
    rmSync(typesTarget, { recursive: true, force: true })
  }

  // Copy built packages
  cpSync(builtSdkDir, sdkTarget, { recursive: true })
  cpSync(builtTypesDir, typesTarget, { recursive: true })

  console.log("✅ Local SDK linked successfully!")
  console.log("💡 You can now test with: cd examples/simple-sdk-samples && bun run <script>")
  console.log("🔄 To revert: cd examples/simple-sdk-samples && bun install --force")
} catch (error) {
  console.error("❌ Error linking local SDK:", error.message)
  process.exit(1)
}
