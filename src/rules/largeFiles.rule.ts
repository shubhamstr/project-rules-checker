import * as vscode from "vscode"
import path from "path"
import fs from "fs"
import { RuleResult } from "../types/rule.types"
import { walkFiles } from "../utils/fs.utils"
import { getRuleConfig } from "../utils/ruleConfig.utils"

interface LargeFilesRuleConfig {
  warningSizeMB?: number
  errorSizeMB?: number
}

export async function largeFilesRule(): Promise<RuleResult[]> {
  const workspaceRoot = vscode.workspace.rootPath
  if (!workspaceRoot) return []
  const root = workspaceRoot

  // ✅ Read config INSIDE rule
  const {
    warningSizeMB = 5,
    errorSizeMB = 20
  } = getRuleConfig<LargeFilesRuleConfig>("large-files")

  const WARN_SIZE = warningSizeMB * 1024 * 1024
  const ERROR_SIZE = errorSizeMB * 1024 * 1024

  const results: RuleResult[] = []

  walkFiles(root, (filePath) => {
    const size = fs.statSync(filePath).size
    if (size < WARN_SIZE) return

    const rel = path.relative(root, filePath)

    if (size > ERROR_SIZE) {
      results.push({
        rule: "large-files",
        level: "error",
        message: `Large file committed (${Math.round(size / 1024 / 1024)}MB): ${rel}`,
        fix: "Remove or use Git LFS"
      })
    } else {
      results.push({
        rule: "large-files",
        level: "warning",
        message: `Large file detected (${Math.round(size / 1024 / 1024)}MB): ${rel}`,
        fix: "Consider ignoring or using Git LFS"
      })
    }
  })

  return results
}
