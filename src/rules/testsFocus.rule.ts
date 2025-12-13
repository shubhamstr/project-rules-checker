import * as vscode from "vscode"
import path from "path"
import { RuleResult } from "../types/rule.types"
import { walkFiles, readFile } from "../utils/fs.utils"

export async function testsFocusRule(): Promise<RuleResult[]> {
  const root = vscode.workspace.rootPath
  if (!root) return []

  const results: RuleResult[] = []

  walkFiles(root, (filePath) => {
    if (!filePath.includes("test")) return

    const content = readFile(filePath)

    if (content.match(/\.(only)\(/)) {
      results.push({
        rule: "tests-only",
        level: "error",
        message: `Focused test (.only) found in ${path.relative(root, filePath)}`,
        fix: "Remove .only before committing"
      })
    }

    if (content.match(/\.(skip)\(/)) {
      results.push({
        rule: "tests-skip",
        level: "warning",
        message: `Skipped test found in ${path.relative(root, filePath)}`,
        fix: "Remove or justify skipped tests"
      })
    }
  })

  return results
}
