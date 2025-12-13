import * as vscode from "vscode"
import path from "path"
import { RuleResult } from "../types/rule.types"
import {
  exists,
  readFile,
  walkFiles,
  isEnvFile
} from "../utils/fs.utils"

const REQUIRED = ["node_modules", "dist", "build"]

export async function gitignoreRule(): Promise<RuleResult[]> {
  const root = vscode.workspace.rootPath
  if (!root) return []

  const gitignorePath = path.join(root, ".gitignore")

  if (!exists(gitignorePath)) {
    return [{
      rule: "gitignore",
      level: "error",
      message: ".gitignore file is missing at project root",
      fix: "Create a .gitignore file"
    }]
  }

  const gitignore = readFile(gitignorePath)
  const results: RuleResult[] = []

  // 1️⃣ Check required ignores
  for (const item of REQUIRED) {
    if (!gitignore.includes(item)) {
      results.push({
        rule: "gitignore",
        level: "warning",
        message: `${item} is not ignored in .gitignore`,
        fix: `Add ${item} to .gitignore`
      })
    }
  }

  // 2️⃣ Collect env files with exact paths
  const envFiles: string[] = []

  walkFiles(root, (filePath) => {
    if (isEnvFile(filePath)) {
      envFiles.push(filePath)
    }
  })

  // 3️⃣ Check env ignore rule ONCE
  const ignoresEnv =
    gitignore.includes(".env*") || gitignore.includes(".env")

  if (!ignoresEnv && envFiles.length > 0) {
    results.push({
      rule: "gitignore",
      level: "error",
      message:
        `Env files are not ignored:\n` +
        envFiles
          .map(f => `- ${path.relative(root, f)}`)
          .join("\n"),
      fix: "Add `.env*` and `!.env.example` to .gitignore"
    })
  }

  return results
}
