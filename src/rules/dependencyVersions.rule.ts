import * as vscode from "vscode"
import path from "path"
import { RuleResult } from "../types/rule.types"
import { readFile, exists } from "../utils/fs.utils"

export async function dependencyVersionRule(): Promise<RuleResult[]> {
  const root = vscode.workspace.rootPath
  if (!root) return []

  const pkgPath = path.join(root, "package.json")
  if (!exists(pkgPath)) return []

  const pkg = JSON.parse(readFile(pkgPath))
  const deps = { ...pkg.dependencies, ...pkg.devDependencies }
  const results: RuleResult[] = []

  for (const [name, version] of Object.entries(deps || {})) {
    if (version === "*" || version === "latest") {
      results.push({
        rule: "dependency-version",
        level: "error",
        message: `Unpinned dependency version: ${name}@${version}`,
        fix: "Use a fixed or ranged version"
      })
    }
  }

  return results
}
