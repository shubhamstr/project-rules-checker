import fs from "fs"
import path from "path"
import * as vscode from "vscode"
import { ProjectRulesConfig } from "../types/projectRules.types"

let cachedConfig: ProjectRulesConfig | null = null

export function loadProjectRulesConfig(): ProjectRulesConfig {
  if (cachedConfig) return cachedConfig!

  const root = vscode.workspace.rootPath
  if (!root) return {}

  const configPath = path.join(root, ".projectrules.json")

  if (!fs.existsSync(configPath)) {
    cachedConfig = {}
    return cachedConfig!
  }

  try {
    const raw = fs.readFileSync(configPath, "utf-8")
    cachedConfig = JSON.parse(raw)
    return cachedConfig!
  } catch (err) {
    vscode.window.showWarningMessage(
      "Invalid .projectrules.json format"
    )
    cachedConfig = {}
    return cachedConfig!
  }
}

export function clearProjectRulesCache() {
  cachedConfig = null
}
