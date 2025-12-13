import * as vscode from "vscode"
import { runAllRules } from "./engine/ruleRunner"
import { RuleResult } from "./types/rule.types"

let outputChannel: vscode.OutputChannel

export function activate(context: vscode.ExtensionContext) {
  outputChannel = vscode.window.createOutputChannel(
    "Project Rules Checker"
  )

  const command = vscode.commands.registerCommand(
    "projectRules.check",
    async () => {
      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: "Scanning project rules",
          cancellable: false
        },
        async (progress) => {
          const results = await runAllRules(
            ({ index, total, ruleName }) => {
              progress.report({
                message: `(${index}/${total}) ${ruleName}`
              })
            }
          )

          outputChannel.clear()
          outputChannel.show(true)

          // ---- SUMMARY ----
          outputChannel.appendLine("PROJECT RULES REPORT")
          outputChannel.appendLine("=".repeat(30))
          outputChannel.appendLine(`Total rules scanned : ${results.length}`)
          outputChannel.appendLine(`Issues found       : ${results.length}`)
          outputChannel.appendLine("")

          if (!results.length) {
            outputChannel.appendLine("✅ No issues found")
            return
          }

          // ---- GROUP BY RULE ----
          printResultsGroupedByRule(outputChannel, results)
        }
      )
    }
  )

  context.subscriptions.push(command, outputChannel)
}

// ----------------------------
// Helper: Group output by rule
// ----------------------------
function printResultsGroupedByRule(
  output: vscode.OutputChannel,
  results: RuleResult[]
) {
  const grouped = new Map<string, RuleResult[]>()

  // Group by rule name
  results.forEach(r => {
    if (!grouped.has(r.rule)) {
      grouped.set(r.rule, [])
    }
    grouped.get(r.rule)!.push(r)
  })

  // Render each rule section
  grouped.forEach((items, rule) => {
    output.appendLine("=".repeat(30))
    output.appendLine(rule.toUpperCase())
    output.appendLine("=".repeat(30))

    items.forEach((r, index) => {
      const icon =
        r.level === "error"
          ? "🚨"
          : r.level === "warning"
            ? "⚠️"
            : "ℹ️"

      output.appendLine(
        `${icon} ${index + 1}. ${r.message}`
      )

      if (r.fix) {
        output.appendLine(`   👉 Fix: ${r.fix}`)
      }
    })

    output.appendLine("")
  })
}

export function deactivate() {
  outputChannel?.dispose()
}
