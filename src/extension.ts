import * as vscode from "vscode"
import { runAllRules } from "./engine/ruleRunner"

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

          outputChannel.appendLine(
            `✔ Scanned ${results.length === 0 ? "all" : ""} rules`
          )
          outputChannel.appendLine(
            `✔ Total rules: ${results.length}`
          )
          outputChannel.appendLine("")

          if (!results.length) {
            outputChannel.appendLine(
              "✅ No issues found"
            )
            return
          }

          outputChannel.appendLine(
            `🔍 Found ${results.length} issue(s):\n`
          )

          results.forEach((r, i) => {
            outputChannel.appendLine(
              `${i + 1}. [${r.level.toUpperCase()}] ${r.message}`
            )
            if (r.fix) {
              outputChannel.appendLine(`   👉 Fix: ${r.fix}`)
            }
            outputChannel.appendLine("")
          })
        }
      )
    }
  )

  context.subscriptions.push(command, outputChannel)
}
