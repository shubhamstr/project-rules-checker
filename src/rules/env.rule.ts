import * as vscode from "vscode"
import path from "path"
import { RuleResult } from "../types/rule.types"
import { walkFiles, isEnvFile } from "../utils/fs.utils"
import { isGitTracked } from "../utils/git.utils"
import { getRuleConfig } from "../utils/ruleConfig.utils"

interface EnvRuleConfig {
  requireExample?: boolean
  allow?: string[]
}

export async function envRule(): Promise<RuleResult[]> {
  const root = vscode.workspace.rootPath
  if (!root) return []

  // ✅ Read config INSIDE the rule
  const {
    requireExample = true,
    allow = []
  } = getRuleConfig<EnvRuleConfig>("env")

  const results: RuleResult[] = []
  let hasExample = false

  walkFiles(root, (filePath) => {
    const base = path.basename(filePath)
    const relative = path.relative(root, filePath)

    // Allowlisted env files
    if (allow.includes(base)) return

    if (base === ".env.example") {
      hasExample = true
      return
    }

    if (isEnvFile(filePath)) {
      // 🚨 Only error if tracked by git
      if (isGitTracked(relative, root)) {
        results.push({
          rule: "env",
          level: "error", // severity override handled centrally
          message: `Tracked environment file detected: ${relative}`,
          fix: "Remove env file from git and add `.env*` to .gitignore"
        })
      }
    }
  })

  // Optional rule behavior via config
  if (requireExample && !hasExample) {
    results.push({
      rule: "env",
      level: "warning",
      message: ".env.example file is missing",
      fix: "Create .env.example without secrets"
    })
  }

  return results
}
