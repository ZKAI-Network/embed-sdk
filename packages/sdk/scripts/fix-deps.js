#!/usr/bin/env bun
/* eslint-disable no-undef */

import { readFileSync, writeFileSync } from "fs"
import { join } from "path"

const distPackagePath = join(process.cwd(), "dist", "package.json")
const typesPackagePath = join(process.cwd(), "..", "types", "package.json")

try {
  // Read the types package version
  const typesPackageJson = JSON.parse(readFileSync(typesPackagePath, "utf8"))
  const typesVersion = typesPackageJson.version

  // Read the SDK dist package.json
  const packageJson = JSON.parse(readFileSync(distPackagePath, "utf8"))

  // Replace workspace dependencies with actual versions
  if (packageJson.dependencies && packageJson.dependencies["@embed-ai/types"] === "workspace:*") {
    packageJson.dependencies["@embed-ai/types"] = `^${typesVersion}`
  }

  writeFileSync(distPackagePath, JSON.stringify(packageJson, null, 2))
  console.log(`✅ Fixed workspace dependencies in dist/package.json: @embed-ai/types@^${typesVersion}`)
} catch (error) {
  console.error("❌ Failed to fix dependencies:", error.message)
  process.exit(1)
}
