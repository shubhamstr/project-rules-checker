import * as vscode from "vscode"
import path from "path"
import { RuleResult } from "../types/rule.types"
import { walkFiles, readFile } from "../utils/fs.utils"

const SECRET_REGEX =
  /(api_key|secret|password|token)\s*=\s*["'][^"']+["']/i

export async function secretRule(): Promise<RuleResult[]> {
  const root = vscode.workspace.rootPath
  if (!root) return []

  const results: RuleResult[] = []

  walkFiles(root, (filePath) => {
    if (!filePath.endsWith(".js") &&
      !filePath.endsWith(".ts") &&
      !filePath.endsWith(".env")) return

    const content = readFile(filePath)

    if (SECRET_REGEX.test(content)) {
      results.push({
        rule: "secrets",
        level: "error",
        message: `Possible secret found in ${path.relative(root, filePath)}`,
        fix: "Move secrets to environment variables"
      })
    }
  })

  return results
}
