import * as vscode from "vscode"
import path from "path"
import { RuleResult } from "../types/rule.types"
import { walkFiles } from "../utils/fs.utils"

export async function folderCaseRule(): Promise<RuleResult[]> {
  const root = vscode.workspace.rootPath
  if (!root) return []

  const results: RuleResult[] = []
  const seen = new Map<string, string>()

  walkFiles(root, (filePath) => {
    const dir = path.dirname(filePath)

    if (!seen.has(dir.toLowerCase())) {
      seen.set(dir.toLowerCase(), dir)
      return
    }

    const existing = seen.get(dir.toLowerCase())
    if (existing && existing !== dir) {
      results.push({
        rule: "folder-case",
        level: "warning",
        message: `Folder case conflict detected:\n${existing}\n${dir}`,
        fix: "Use consistent lowercase folder naming"
      })
    }
  })

  return results
}
