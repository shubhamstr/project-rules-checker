import * as vscode from "vscode"
import path from "path"
import { RuleResult } from "../types/rule.types"
import { walkFiles, readFile } from "../utils/fs.utils"
import { getRuleConfig } from "../utils/ruleConfig.utils"

interface ImportDepthRuleConfig {
  maxDepth?: number
}

export async function importDepthRule(): Promise<RuleResult[]> {
  const root = vscode.workspace.rootPath
  if (!root) return []

  // ✅ Read config INSIDE rule
  const { maxDepth = 3 } =
    getRuleConfig<ImportDepthRuleConfig>("imports-depth")

  const results: RuleResult[] = []

  walkFiles(root, (filePath) => {
    if (!filePath.match(/\.(ts|js|tsx|jsx)$/)) return

    const content = readFile(filePath)
    const lines = content.split("\n")
    const relative = path.relative(root, filePath)

    lines.forEach((line, index) => {
      // Match relative imports
      const match = line.match(/from\s+["'](\.\.\/)+/)
      if (!match) return

      const depth = match[1].split("../").length - 1

      if (depth > maxDepth) {
        results.push({
          rule: "imports-depth",
          level: "warning",
          message:
            `Deep relative import (${depth} levels) in ${relative} (line ${index + 1})`,
          fix: "Use absolute imports or path aliases"
        })
      }
    })
  })

  return results
}
