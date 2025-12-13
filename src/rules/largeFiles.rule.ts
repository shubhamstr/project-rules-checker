import * as vscode from "vscode"
import path from "path"
import fs from "fs"
import { RuleResult } from "../types/rule.types"
import { walkFiles } from "../utils/fs.utils"
import { loadProjectRulesConfig } from "../config/projectRules.config"

const config = loadProjectRulesConfig()
const ruleConfig = config.rules?.["large-files"]

const WARN_SIZE = (ruleConfig?.warningSizeMB ?? 5) * 1024 * 1024
const ERROR_SIZE = (ruleConfig?.errorSizeMB ?? 20) * 1024 * 1024

export async function largeFilesRule(): Promise<RuleResult[]> {
  const workspaceRoot = vscode.workspace.rootPath
  if (!workspaceRoot) return []
  const root = workspaceRoot

  const results: RuleResult[] = []

  walkFiles(root, (filePath) => {
    const size = fs.statSync(filePath).size
    const rel = path.relative(root, filePath)

    if (size > ERROR_SIZE) {
      results.push({
        rule: "large-files",
        level: "error",
        message: `Large file committed (${Math.round(size / 1024 / 1024)}MB): ${rel}`,
        fix: "Remove or use Git LFS"
      })
    } else if (size > WARN_SIZE) {
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
