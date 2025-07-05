# 📦 thanks-to

> Generate beautiful acknowledgments for your project's dependencies.  
> Perfect for credits, open source disclosures, or "Thanks" sections.

---

## ✨ Features

- ✅ Auto-detects `dependencies` and `devDependencies`
- ✅ Distinguishes direct and transitive dependencies
- ✅ Outputs to `./thanks-to/` folder by default
- ✅ Supports JSON, Markdown, and HTML
- ✅ Customizable CLI: choose formats, include dev or transitive deps
- ✅ Designed for humans – readable, copy-pasteable, docs-ready

---

## 🔧 Installation

```bash
npm install --save-dev thanks-to
```

Or use directly without install:

```bash
npx thanks-to
```

---

## 🚀 Usage

### Basic (default)

```bash
npx thanks-to
```

- Exports direct runtime dependencies
- Generates 3 files: `credits.json`, `credits.md`, `credits.html` in `./thanks-to`

---

### Options

| Option             | Description                                      |
|--------------------|--------------------------------------------------|
| `--dev`            | Include `devDependencies`                        |
| `--transitive`     | Include transitive (indirect) dependencies       |
| `--report <types>` | Export formats: `json,md,html` (comma-separated) |
| `--output <dir>`   | Custom output folder (default: `./thanks-to`)    |
| `--silent`         | Suppress logs                                    |

---

### Examples

```bash
# Only export markdown
npx thanks-to --report md

# Include dev + transitive deps, only HTML
npx thanks-to --dev --transitive --report html

# Export into docs folder
npx thanks-to --output ./docs/credits
```

---

## 📁 Output

### Markdown (`credits.md`)

\`\`\`md
# 📦 Thanks to Open Source

## Dependencies (Direct)
- [chalk](https://github.com/chalk/chalk) – MIT

## Dev Dependencies (Direct)
- [eslint](https://github.com/eslint/eslint) – MIT
\`\`\`

---

### HTML (`credits.html`)

A clean, dark-mode-friendly HTML page you can embed in documentation or publish on GitHub Pages.

> Supports sectioning, clickable repo links, license info, and more.

---

### JSON (`credits.json`)

Machine-readable output with structure:

\`\`\`json
{
  "dependencies": {
    "direct": [
      {
        "name": "chalk",
        "version": "5.3.0",
        "license": "MIT",
        "resolvedRepo": "https://github.com/chalk/chalk"
      }
    ],
    "transitive": [...]
  },
  "devDependencies": {
    "direct": [...],
    "transitive": [...]
  }
}
\`\`\`

---

## 🧠 Why use this?

- ❤️ Add credit to the open-source community
- 📑 Show dependencies in published research or products
- 📃 Required for compliance in some orgs
- ✨ Just be a good human

---

## 📜 License

MIT © [Yuki]

---
