import * as vscode from "vscode"
import path from "path"
import { RuleResult } from "../types/rule.types"
import { walkFiles, readFile } from "../utils/fs.utils"
import { getRuleConfig } from "../utils/ruleConfig.utils"

// ---- Regexes ----

// Any IPv4
const IP_REGEX =
  /\b(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\b/

// Private IP ranges
const PRIVATE_IP_REGEX =
  /\b(10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+)\b/

// Localhost
const LOCAL_IP_REGEX =
  /\b(127\.0\.0\.1|localhost)\b/

// Credentials in same line
const CREDENTIAL_REGEX =
  /(\/\/.*?:.*?@|password\s*=|secret\s*=|token\s*=)/i

// Only scan code files
const CODE_EXTENSIONS = [
  ".js", ".ts", ".jsx", ".tsx",
  ".java", ".go", ".py",
  ".php", ".cs", ".rb"
]

interface IpRuleConfig {
  allow?: string[]
}

export async function ipRule(): Promise<RuleResult[]> {
  const root = vscode.workspace.rootPath
  if (!root) return []

  // ✅ Read config INSIDE rule
  const { allow = [] } = getRuleConfig<IpRuleConfig>("ip")

  const results: RuleResult[] = []

  walkFiles(root, (filePath) => {
    const ext = path.extname(filePath)

    // Ignore non-code files
    if (!CODE_EXTENSIONS.includes(ext)) return

    // Ignore env files
    if (filePath.includes(".env")) return

    const content = readFile(filePath)
    const lines = content.split("\n")
    const relative = path.relative(root, filePath)

    lines.forEach((line, index) => {
      const match = line.match(IP_REGEX)
      if (!match) return

      const ip = match[0]

      // Allow localhost
      if (LOCAL_IP_REGEX.test(ip)) return

      // ✅ Allowlist support
      if (allow.includes(ip)) return

      // 🔥 IP + credentials → HIGH severity
      if (CREDENTIAL_REGEX.test(line)) {
        results.push({
          rule: "ip",
          level: "error",
          message:
            `IP address with credentials found in ${relative} (line ${index + 1})`,
          fix: "Move credentials and host to environment variables"
        })
        return
      }

      // ⚠️ Private IP
      if (PRIVATE_IP_REGEX.test(ip)) {
        results.push({
          rule: "ip",
          level: "warning",
          message:
            `Hardcoded private IP found in ${relative} (line ${index + 1})`,
          fix: "Move IP to environment configuration"
        })
        return
      }

      // 🚨 Public IP
      results.push({
        rule: "ip",
        level: "error",
        message:
          `Hardcoded public IP found in ${relative} (line ${index + 1})`,
        fix: "Use DNS name or environment variables instead of IP"
      })
    })
  })

  return results
}
