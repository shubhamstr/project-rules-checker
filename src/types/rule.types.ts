export type RuleLevel = "info" | "warning" | "error"

export interface RuleResult {
  rule: string
  level: RuleLevel
  message: string
  fix?: string
}
