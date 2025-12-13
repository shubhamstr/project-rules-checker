import * as vscode from "vscode"
import path from "path"
import fs from "fs"
import { RuleResult } from "../types/rule.types"

const IGNORE_DIRS = [
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  ".turbo"
]

export async function folderCaseRule(): Promise<RuleResult[]> {
  const workspaceRoot = vscode.workspace.rootPath
  if (!workspaceRoot) return []

  const root = workspaceRoot // ✅ now type is string
  const results: RuleResult[] = []

  function walkDir(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    const nameMap = new Map<string, string>()

    for (const entry of entries) {
      if (!entry.isDirectory()) continue
      if (IGNORE_DIRS.includes(entry.name)) continue

      const lower = entry.name.toLowerCase()

      if (nameMap.has(lower)) {
        const existing = nameMap.get(lower)! // safe

        results.push({
          rule: "folder-case",
          level: "warning",
          message:
            `Folder case conflict detected in ${path.relative(root, dir)}:\n` +
            `- ${existing}\n` +
            `- ${entry.name}`,
          fix: "Use consistent lowercase folder names"
        })
      } else {
        nameMap.set(lower, entry.name)
      }

      walkDir(path.join(dir, entry.name))
    }
  }

  walkDir(root)

  return results
}
