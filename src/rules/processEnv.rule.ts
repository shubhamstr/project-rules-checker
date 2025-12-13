import * as vscode from "vscode"
import path from "path"
import { RuleResult } from "../types/rule.types"
import { walkFiles, readFile } from "../utils/fs.utils"

export async function processEnvRule(): Promise<RuleResult[]> {
  const root = vscode.workspace.rootPath
  if (!root) return []

  const results: RuleResult[] = []

  walkFiles(root, (filePath) => {
    if (!filePath.match(/\.(ts|js)$/)) return
    if (filePath.includes("/config")) return

    const content = readFile(filePath)
    if (content.includes("process.env.")) {
      results.push({
        rule: "process-env",
        level: "warning",
        message: `process.env used outside config: ${path.relative(root, filePath)}`,
        fix: "Access env vars via config module"
      })
    }
  })

  return results
}
