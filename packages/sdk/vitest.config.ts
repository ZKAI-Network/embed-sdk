import { mergeConfig, type UserConfigExport } from "vitest/config"
import shared from "../../vitest.shared.js"

const config: UserConfigExport = {
  test: {
    setupFiles: ["./test/setup.ts"],
    testTimeout: 30000, // 30s timeout for API calls
    include: ["test/**/*.test.ts"],
    exclude: ["node_modules/**", "dist/**"],
    reporters: ["verbose", "json"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.d.ts", "src/**/*.test.ts"]
    }
  }
}

export default mergeConfig(shared, config)
