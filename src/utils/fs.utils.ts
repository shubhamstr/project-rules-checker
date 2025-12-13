import fs from "fs"
import path from "path"

const IGNORE_DIRS = [
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  ".turbo",
  "coverage"
]

const IGNORE_FILE_PATTERNS = [
  /\.min\.(js|css)$/,
  /\.bundle\.js$/,
  /\.chunk\.js$/,
  /\.map$/
]

export function shouldIgnoreFile(filePath: string): boolean {
  return IGNORE_FILE_PATTERNS.some(r => r.test(filePath))
}

export function walkFiles(
  dir: string,
  callback: (filePath: string) => void
) {
  if (!fs.existsSync(dir)) return

  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      if (IGNORE_DIRS.includes(entry.name)) continue
      walkFiles(fullPath, callback)
    } else {
      if (shouldIgnoreFile(fullPath)) continue
      callback(fullPath)
    }
  }
}

export function readFile(filePath: string): string {
  return fs.readFileSync(filePath, "utf-8")
}

export function exists(filePath: string): boolean {
  return fs.existsSync(filePath)
}

export function isEnvFile(filePath: string): boolean {
  const base = path.basename(filePath)

  // Matches: .env, .env.local, .env.dev, .env.production, etc
  if (!base.startsWith(".env")) return false

  // Allow example files
  if (base === ".env.example") return false

  return true
}

