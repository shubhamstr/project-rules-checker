import * as vscode from "vscode"
import path from "path"
import { RuleResult } from "../types/rule.types"
import { walkFiles, readFile } from "../utils/fs.utils"

export async function consoleRule(): Promise<RuleResult[]> {
  const root = vscode.workspace.rootPath
  if (!root) return []

  const results: RuleResult[] = []

  walkFiles(root, (filePath) => {
    if (!filePath.match(/\.(ts|js)$/)) return
    if (filePath.includes("test") || filePath.includes("scripts")) return

    const content = readFile(filePath)
    if (content.includes("console.log(")) {
      results.push({
        rule: "console",
        level: "warning",
        message: `console.log found in ${path.relative(root, filePath)}`,
        fix: "Use proper logger or remove console.log"
      })
    }
  })

  return results
}
