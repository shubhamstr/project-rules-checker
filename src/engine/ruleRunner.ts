import { RuleResult } from "../types/rule.types"
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

export async function runAllRules(): Promise<RuleResult[]> {
  return [
    ...(await envRule()),
    ...(await gitignoreRule()),
    ...(await readmeRule()),
    ...(await folderCaseRule()),
    ...(await secretRule()),
    ...(await ipRule()),
    ...(await lockfileRule()),
    ...(await largeFilesRule()),
    ...(await importDepthRule()),
    ...(await consoleRule()),
    ...(await dangerousApisRule()),
    ...(await processEnvRule()),
    ...(await testsFocusRule()),
    ...(await todoRule()),
    ...(await dependencyVersionRule())
  ]
}
