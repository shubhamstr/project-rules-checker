import { isRuleEnabled, applyRuleSeverity } from "../utils/ruleConfig.utils"
import { RuleResult } from "../types/rule.types"

// Import rules
import { envRule } from "../rules/env.rule"
import { gitignoreRule } from "../rules/gitignore.rule"
import { readmeRule } from "../rules/readme.rule"
import { folderCaseRule } from "../rules/folderCase.rule"
import { secretRule } from "../rules/secret.rule"
import { ipRule } from "../rules/ip.rule"
import { lockfileRule } from "../rules/lockfile.rule"
import { largeFilesRule } from "../rules/largeFiles.rule"
import { importDepthRule } from "../rules/importsDepth.rule"
import { consoleRule } from "../rules/console.rule"
import { dangerousApisRule } from "../rules/dangerousApis.rule"
import { processEnvRule } from "../rules/processEnv.rule"
import { testsFocusRule } from "../rules/testsFocus.rule"
import { todoRule } from "../rules/todo.rule"
import { dependencyVersionRule } from "../rules/dependencyVersions.rule"

export const RULES = [
  { key: "env", name: "Env safety", run: envRule },
  { key: "gitignore", name: "Gitignore hygiene", run: gitignoreRule },
  { key: "readme", name: "README rules", run: readmeRule },
  { key: "folder-case", name: "Folder case conflicts", run: folderCaseRule },
  { key: "secret", name: "Secret exposed", run: secretRule },
  { key: "ip", name: "IP hardcoding", run: ipRule },
  { key: "lockfile", name: "Lock file consistency", run: lockfileRule },
  { key: "large-files", name: "Large files", run: largeFilesRule },
  { key: "imports-depth", name: "Import depth", run: importDepthRule },
  { key: "console", name: "Console logs", run: consoleRule },
  { key: "dangerous-api", name: "Dangerous APIs", run: dangerousApisRule },
  { key: "process-env", name: "process.env usage", run: processEnvRule },
  { key: "tests-only", name: "Test focus / skip", run: testsFocusRule },
  { key: "todo", name: "TODO / FIXME", run: todoRule },
  { key: "dependency-version", name: "Dependency versions", run: dependencyVersionRule }
]

export async function runAllRules(
  onProgress?: (info: {
    index: number
    total: number
    ruleName: string
  }) => void
): Promise<RuleResult[]> {
  const results: RuleResult[] = []
  const total = RULES.length
  let executed = 0

  for (let i = 0; i < total; i++) {
    const rule = RULES[i]

    if (!isRuleEnabled(rule.key)) continue

    executed++

    onProgress?.({
      index: executed,
      total,
      ruleName: rule.name
    })

    try {
      const ruleResults = await rule.run()

      for (const r of ruleResults) {
        const updated = applyRuleSeverity(rule.key, r)
        if (updated) results.push(updated)
      }
    } catch {
      results.push({
        rule: rule.key,
        level: "error",
        message: `Rule "${rule.name}" failed to execute`,
        fix: "Check rule implementation"
      })
    }
  }

  return results
}
