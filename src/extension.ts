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
          title: "Scanning project structure…",
          cancellable: false
        },
        async () => {
          const results = await runAllRules()

          outputChannel.clear()
          outputChannel.show(true)

          if (!results.length) {
            outputChannel.appendLine(
              "✅ Project follows all dev rules"
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

export function deactivate() {
  outputChannel?.dispose()
}
