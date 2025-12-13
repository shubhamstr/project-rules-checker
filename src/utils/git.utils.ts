import { execSync } from "child_process"

export function isGitTracked(filePath: string, root: string): boolean {
  try {
    const result = execSync(
      `git ls-files --error-unmatch "${filePath}"`,
      { cwd: root, stdio: "pipe" }
    )
    return !!result
  } catch {
    return false
  }
}
