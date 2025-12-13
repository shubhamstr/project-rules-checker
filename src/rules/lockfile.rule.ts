import * as vscode from "vscode"
import path from "path"
import { RuleResult } from "../types/rule.types"
import { exists } from "../utils/fs.utils"

const LOCK_FILES = [
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml"
]

export async function lockfileRule(): Promise<RuleResult[]> {
  const workspaceRoot = vscode.workspace.rootPath
  if (!workspaceRoot) return []
  const root = workspaceRoot

  const results: RuleResult[] = []

  if (!exists(path.join(root, "package.json"))) return []

  const found = LOCK_FILES.filter(f =>
    exists(path.join(root, f))
  )

  if (found.length === 0) {
    results.push({
      rule: "lockfile",
      level: "warning",
      message: "No lock file found for package.json",
      fix: "Commit exactly one lock file"
    })
  }

  if (found.length > 1) {
    results.push({
      rule: "lockfile",
      level: "error",
      message: `Multiple lock files found: ${found.join(", ")}`,
      fix: "Keep only one lock file"
    })
  }

  return results
}
