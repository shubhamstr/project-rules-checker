export type RuleSeverity = "error" | "warning" | "info" | "off"

export interface RuleConfig {
  enabled?: boolean
  severity?: RuleSeverity
  [key: string]: any
}

export interface ProjectRulesConfig {
  mode?: "dev" | "ci"
  ignore?: string[]
  rules?: Record<string, RuleConfig>
}
