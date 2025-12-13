import * as vscode from "vscode"
import path from "path"
import { RuleResult } from "../types/rule.types"
import { walkFiles, readFile } from "../utils/fs.utils"

const IMPORT_REGEX = /from\s+["'](\.\.\/){3,}/

export async function importDepthRule(): Promise<RuleResult[]> {
  const root = vscode.workspace.rootPath
  if (!root) return []

  const results: RuleResult[] = []

  walkFiles(root, (filePath) => {
    if (!filePath.match(/\.(ts|js|tsx|jsx)$/)) return

    const content = readFile(filePath)
    if (IMPORT_REGEX.test(content)) {
      results.push({
        rule: "imports-depth",
        level: "warning",
        message: `Deep relative imports used in ${path.relative(root, filePath)}`,
        fix: "Use absolute imports or aliases"
      })
    }
  })

  return results
}
