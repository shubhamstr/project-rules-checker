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
  { name: "Env safety", run: envRule },
  { name: "Gitignore hygiene", run: gitignoreRule },
  { name: "README rules", run: readmeRule },
  { name: "Folder case conflicts", run: folderCaseRule },
  { name: "Secret Exposed", run: secretRule },
  { name: "IP hardcoding", run: ipRule },
  { name: "Lock file consistency", run: lockfileRule },
  { name: "Large files", run: largeFilesRule },
  { name: "Import depth", run: importDepthRule },
  { name: "Console logs", run: consoleRule },
  { name: "Dangerous APIs", run: dangerousApisRule },
  { name: "process.env usage", run: processEnvRule },
  { name: "Test focus / skip", run: testsFocusRule },
  { name: "TODO / FIXME", run: todoRule },
  { name: "Dependency versions", run: dependencyVersionRule }
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

  for (let i = 0; i < total; i++) {
    const rule = RULES[i]

    onProgress?.({
      index: i + 1,
      total,
      ruleName: rule.name
    })

    const ruleResults = await rule.run()
    results.push(...ruleResults)
  }

  return results
}
