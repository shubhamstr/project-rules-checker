import { RuleResult } from "../types/rule.types"
import { envRule } from "../rules/env.rule"
import { gitignoreRule } from "../rules/gitignore.rule"
import { readmeRule } from "../rules/readme.rule"
import { folderCaseRule } from "../rules/folderCase.rule"
import { secretRule } from "../rules/secret.rule"
import { ipRule } from "../rules/ip.rule"

export async function runAllRules(): Promise<RuleResult[]> {
  return [
    ...(await envRule()),
    ...(await gitignoreRule()),
    ...(await readmeRule()),
    ...(await folderCaseRule()),
    ...(await secretRule()),
    ...(await ipRule())
  ]
}
