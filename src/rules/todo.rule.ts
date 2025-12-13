import * as vscode from "vscode"
import path from "path"
import { RuleResult } from "../types/rule.types"
import { walkFiles, readFile } from "../utils/fs.utils"

export async function todoRule(): Promise<RuleResult[]> {
  const root = vscode.workspace.rootPath
  if (!root) return []

  const results: RuleResult[] = []

  walkFiles(root, (filePath) => {
    if (!filePath.match(/\.(ts|js)$/)) return

    const content = readFile(filePath)
    if (content.match(/TODO|FIXME/)) {
      results.push({
        rule: "todo",
        level: "warning",
        message: `TODO/FIXME found in ${path.relative(root, filePath)}`,
        fix: "Resolve or track via issue"
      })
    }
  })

  return results
}
