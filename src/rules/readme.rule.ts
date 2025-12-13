import * as vscode from "vscode"
import path from "path"
import { RuleResult } from "../types/rule.types"
import { walkFiles, readFile } from "../utils/fs.utils"

const SECRET_REGEX =
  /(api[_-]?key|secret|password|token)\s*[:=]\s*["']?[a-z0-9_\-]{8,}["']?/i

const PLACEHOLDER_REGEX =
  /(your_|xxxxx|example|sample|<.*?>)/i

export async function readmeRule(): Promise<RuleResult[]> {
  const root = vscode.workspace.rootPath
  if (!root) return []

  const results: RuleResult[] = []
  let readmePath: string | null = null

  // 1️⃣ Find README.md
  walkFiles(root, (filePath) => {
    if (path.basename(filePath).toLowerCase() === "readme.md") {
      readmePath = filePath
    }
  })

  if (!readmePath) {
    return [{
      rule: "readme",
      level: "info",
      message: "README.md not found in project",
      fix: "Add a README.md at project root"
    }]
  }

  // 2️⃣ Scan README content
  const content = readFile(readmePath)
  const lines = content.split("\n")

  lines.forEach((line, index) => {
    if (
      SECRET_REGEX.test(line) &&
      !PLACEHOLDER_REGEX.test(line)
    ) {
      results.push({
        rule: "readme",
        level: "warning",
        message:
          `Possible secret found in README.md ` +
          `(line ${index + 1})`,
        fix:
          "Replace real secrets with placeholders (e.g. YOUR_API_KEY)"
      })
    }
  })

  return results
}
