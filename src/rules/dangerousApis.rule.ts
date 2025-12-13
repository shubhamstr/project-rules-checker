import * as vscode from "vscode"
import path from "path"
import { RuleResult } from "../types/rule.types"
import { walkFiles, readFile } from "../utils/fs.utils"

const BAD_APIS = ["eval(", "new Function(", "setTimeout(\""]

export async function dangerousApisRule(): Promise<RuleResult[]> {
  const root = vscode.workspace.rootPath
  if (!root) return []

  const results: RuleResult[] = []

  walkFiles(root, (filePath) => {
    if (!filePath.match(/\.(ts|js)$/)) return

    const content = readFile(filePath)
    for (const api of BAD_APIS) {
      if (content.includes(api)) {
        results.push({
          rule: "dangerous-api",
          level: "error",
          message: `Dangerous API "${api}" used in ${path.relative(root, filePath)}`,
          fix: "Avoid dynamic code execution"
        })
      }
    }
  })

  return results
}
