import { isRuleEnabled, applyRuleSeverity } from "../utils/ruleConfig.utils"

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
  { key: "secret", name: "Secret Exposed", run: secretRule },
  { key: "ip", name: "IP hardcoding", run: ipRule },
  { key: "lock-files", name: "Lock file consistency", run: lockfileRule },
  { key: "large-files", name: "Large files", run: largeFilesRule },
  { key: "import", name: "Import depth", run: importDepthRule },
  { key: "console", name: "Console logs", run: consoleRule },
  { key: "danger-apis", name: "Dangerous APIs", run: dangerousApisRule },
  { key: "process-env", name: "process.env usage", run: processEnvRule },
  { key: "test-focus", name: "Test focus / skip", run: testsFocusRule },
  { key: "todo-fixme", name: "TODO / FIXME", run: todoRule },
  { key: "version", name: "Dependency versions", run: dependencyVersionRule }
]

export async function runAllRules(
  onProgress?: (info: {
    index: number
    total: number
    ruleName: string
  }) => void
) {
  const results = []
  const total = RULES.length

  for (let i = 0; i < total; i++) {
    const rule = RULES[i]

    if (!isRuleEnabled(rule.key)) {
      continue
    }

    onProgress?.({
      index: i + 1,
      total,
      ruleName: rule.name
    })

    const ruleResults = await rule.run()

    for (const r of ruleResults) {
      const updated = applyRuleSeverity(rule.key, r)
      if (updated) results.push(updated)
    }
  }

  return results
}
