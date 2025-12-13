import * as vscode from "vscode"
import path from "path"
import { RuleResult } from "../types/rule.types"
import { walkFiles, isEnvFile } from "../utils/fs.utils"
import { isGitTracked } from "../utils/git.utils"

export async function envRule(): Promise<RuleResult[]> {
  const root = vscode.workspace.rootPath
  if (!root) return []

  const results: RuleResult[] = []
  let hasExample = false

  walkFiles(root, (filePath) => {
    const base = path.basename(filePath)

    if (base === ".env.example") {
      hasExample = true
      return
    }

    if (isEnvFile(filePath)) {
      const relative = path.relative(root, filePath)

      // ✅ Only warn if tracked by git
      if (isGitTracked(relative, root)) {
        results.push({
          rule: "env",
          level: "error",
          message: `Tracked environment file detected: ${relative}`,
          fix: "Remove env file from git and add it to .gitignore"
        })
      }
    }
  })

  if (!hasExample) {
    results.push({
      rule: "env",
      level: "warning",
      message: ".env.example file is missing",
      fix: "Create .env.example without secrets"
    })
  }

  return results
}
