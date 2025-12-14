# 🧩 Project Rules Checker

A VS Code extension that scans your project and validates **senior-level engineering best practices** such as:

* Environment safety
* Git hygiene
* Security issues
* Architecture violations
* Performance pitfalls
* Testing mistakes

It is **configurable**, **non-intrusive**, and designed to work well in **real production teams**.

---

## ✨ Features

* ✅ Recursive project scanning
* ✅ Rule-wise grouped output
* ✅ Progress indicator during scan
* ✅ Configurable rules via `.projectrules.json`
* ✅ Environment-aware (dev vs CI ready)
* ✅ Fast & ignores generated/minified files

---

## 🚀 Getting Started

### 1️⃣ Install & Run

Open the Command Palette in VS Code:

```
Ctrl + Shift + P
```

Run:

```
Project Rules: Project Rules Checker
```

The scan results will appear in the **Output panel** under:

```
Project Rules Checker
```

---

## ⚙️ Configuration with `.projectrules.json`

You can customize the behavior of the extension by adding a
`.projectrules.json` file at your **project root**.

> If the file is missing, **sensible defaults** are used.

---

## 📄 Example `.projectrules.json`

```json
{
  "$schema": "./schemas/projectrules.schema.json",
  "mode": "dev",
  "ignore": [
    "node_modules",
    "dist",
    "build",
    "**/*.spec.ts"
  ],
  "rules": {
    "env": {
      "enabled": true,
      "severity": "error",
      "requireExample": true,
      "allow": [".env.local", ".env.development"]
    },
    "gitignore": {
      "enabled": true,
      "severity": "warning"
    },
    "readme": {
      "enabled": true
    },
    "folder-case": {
      "enabled": true,
      "severity": "warning"
    },
    "secret": {
      "enabled": true,
      "severity": "error"
    },
    "ip": {
      "enabled": true,
      "severity": "error",
      "allow": ["127.0.0.1", "10.0.0.5"]
    },
    "lockfile": {
      "enabled": true,
      "severity": "error"
    },
    "large-files": {
      "enabled": true,
      "warningSizeMB": 5,
      "errorSizeMB": 20
    },
    "imports-depth": {
      "enabled": true,
      "maxDepth": 4
    },
    "console": {
      "enabled": true,
      "severity": "warning"
    },
    "dangerous-api": {
      "enabled": true,
      "severity": "error"
    },
    "process-env": {
      "enabled": true,
      "severity": "warning"
    },
    "tests-only": {
      "enabled": true,
      "severity": "error"
    },
    "todo": {
      "enabled": true,
      "severity": "warning"
    },
    "dependency-version": {
      "enabled": true,
      "severity": "warning"
    }
  }
}
```

---

## 🧠 Config Fields Explained

### 🔹 `mode`

```json
"mode": "dev"
```

| Mode  | Behavior                                     |
| ----- | -------------------------------------------- |
| `dev` | Developer-friendly (warnings preferred)      |
| `ci`  | Stricter (errors fail builds – future ready) |

---

### 🔹 `ignore`

Glob patterns or folder names to **skip during scanning**.

```json
"ignore": ["node_modules", "dist", "**/*.test.ts"]
```

Useful for:

* Build artifacts
* Generated code
* Vendor files

---

### 🔹 `rules`

Each rule can be **enabled, disabled, or customized**.

---

## 🧪 Rule Configuration Format

```json
"rule-name": {
  "enabled": true,
  "severity": "warning"
}
```

### Severity Levels

| Value     | Meaning                 |
| --------- | ----------------------- |
| `error`   | Serious issue           |
| `warning` | Best-practice violation |
| `info`    | Recommendation          |
| `off`     | Disable rule            |

---

## 📜 Supported Rules (Current)

| Rule Key             | Description                       |
| -------------------- | --------------------------------- |
| `env`                | Environment file safety (`.env*`) |
| `gitignore`          | Git ignore hygiene                |
| `folder-case`        | Folder naming conflicts           |
| `ip`                 | Hardcoded IP detection            |
| `console`            | `console.log` in source           |
| `large-files`        | Large files in repo               |
| `lockfile`           | Multiple / missing lock files     |
| `imports-depth`      | Deep relative imports             |
| `dangerous-api`      | `eval`, `new Function`, etc       |
| `process-env`        | `process.env` outside config      |
| `tests-only`         | Focused or skipped tests          |
| `todo`               | TODO / FIXME in production        |
| `dependency-version` | Wildcard dependency versions      |

---

## 🔐 Example: IP Rule Configuration

```json
"ip": {
  "enabled": true,
  "severity": "error",
  "allow": ["127.0.0.1"]
}
```

Behavior:

* ✅ Allows `localhost`, `127.0.0.1`
* ⚠️ Warns on private IPs
* 🚨 Errors on public IPs in code

---

## 📦 Example: Large File Rule

```json
"large-files": {
  "enabled": true,
  "warningSizeMB": 5,
  "errorSizeMB": 20
}
```

---

## 🧠 Best Practices (Recommended)

✔ Commit `.projectrules.json` to repo
✔ Keep rules **strict in CI**, flexible in dev
✔ Disable noisy rules only when justified
✔ Use warnings to guide, not block developers

---

## 🧪 Example Output

```
==============================
ENV
==============================
🚨 Tracked environment file detected: .env.production
   👉 Fix: Remove env file from git and add it to .gitignore

==============================
IP
==============================
⚠️ Hardcoded private IP found in src/db/config.ts (line 12)
```

---

## 🛣️ Roadmap (Coming Soon)

* Problems tab integration
* Quick Fix (auto-fix `.gitignore`, env issues)
* Live config reload
* CI mode enforcement
* GitHub Action support

---

## 🤝 Contributing

This tool is designed to be **extensible**.

To add a rule:

1. Create a file in `src/rules/`
2. Return `RuleResult[]`
3. Register it in `ruleRunner.ts`
4. Add config support via `.projectrules.json`

---

## 🏁 Final Note

This tool is inspired by:

* ESLint
* SonarQube
* Semgrep

…but optimized for **developer experience**.

If you’re building internal tooling or improving code quality across teams, this extension is meant for you.
