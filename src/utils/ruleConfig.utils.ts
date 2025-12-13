import { RuleResult } from "../types/rule.types"
import { loadProjectRulesConfig } from "../config/projectRules.config"

export function isRuleEnabled(ruleName: string): boolean {
  const config = loadProjectRulesConfig()
  const rule = config.rules?.[ruleName]

  if (!rule) return true
  if (rule.enabled === false) return false

  return true
}

export function applyRuleSeverity(
  ruleName: string,
  result: RuleResult
): RuleResult | null {
  const config = loadProjectRulesConfig()
  const rule = config.rules?.[ruleName]

  if (!rule) return result

  if (rule.severity === "off") return null

  if (rule.severity) {
    return {
      ...result,
      level: rule.severity
    }
  }

  return result
}
