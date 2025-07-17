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

  // Read the React dist package.json
  const packageJson = JSON.parse(readFileSync(distPackagePath, "utf8"))

  // Fix the paths for publishing from dist directory
  packageJson.main = "./index.js"
  packageJson.module = "./index.js"
  packageJson.types = "./index.d.ts"
  
  // Update files array for dist directory
  packageJson.files = [
    "**/*",
    "!**/*.map",
    "!**/*.tsbuildinfo"
  ]
  
  // Update exports for dist directory
  packageJson.exports = {
    ".": {
      types: "./index.d.ts",
      import: "./index.js"
    },
    "./ui": {
      types: "./ui/index.d.ts",
      import: "./ui/index.js"
    },
    "./feed": {
      types: "./feed/index.d.ts",
      import: "./feed/index.js"
    },
    "./media": {
      types: "./media/index.d.ts",
      import: "./media/index.js"
    },
    "./utils": {
      types: "./lib/utils.d.ts",
      import: "./lib/utils.js"
    }
  }

  // Replace workspace dependencies with actual versions
  if (packageJson.devDependencies && packageJson.devDependencies["@embed-ai/types"] === "workspace:*") {
    packageJson.devDependencies["@embed-ai/types"] = `^${typesVersion}`
  }

  writeFileSync(distPackagePath, JSON.stringify(packageJson, null, 2))
  console.log(`✅ Fixed package.json paths and dependencies for dist publishing`)
} catch (error) {
  console.error("❌ Failed to fix package.json:", error.message)
  process.exit(1)
}