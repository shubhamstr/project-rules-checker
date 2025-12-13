import { RuleResult } from "../types/rule.types"
import { loadProjectRulesConfig } from "../config/projectRules.config"

/**
 * Check if a rule is enabled
 */
export function isRuleEnabled(ruleName: string): boolean {
  const config = loadProjectRulesConfig()
  const rule = config.rules?.[ruleName]

  if (!rule) return true
  if (rule.enabled === false) return false

  return true
}

/**
 * Apply severity override / off
 */
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

/**
 * 🔥 NEW: Get rule-specific config safely
 */
export function getRuleConfig<T = Record<string, any>>(
  ruleName: string
): T {
  const config = loadProjectRulesConfig()
  return (config.rules?.[ruleName] ?? {}) as T
}
