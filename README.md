# thanks-to

> Generate beautiful acknowledgments for your project's dependencies.  
> Perfect for credits, open source disclosures, or "Thanks" sections.

---

## ✨ Features

- ✅ Auto-detects `dependencies` and `devDependencies`
- ✅ Distinguishes direct and transitive dependencies
- ✅ Outputs to `./thanks-to/` folder by default
- ✅ Supports JSON, Markdown, CSV, and HTML
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

| Option                     | Description                                                   |
| -------------------------- | ------------------------------------------------------------- |
| `--transitive`             | Include transitive (indirect) dependencies                    |
| `--report <types>`         | Export formats: `json,md,csv,html` (comma-separated)          |
| `--output <dir>`           | Custom output folder (default: `./thanks-to`)                 |
| `--silent`                 | Suppress logs                                                 |
| `--only <group>`           | `deps`, `devDeps`, or `all` – choose which group to include   |
| `--only-license <list>`    | Only include licenses in list (e.g. `mit,apache`)             |
| `--exclude-license <list>` | Exclude licenses (e.g. `gpl,agpl`)                            |
| `--include-package <list>` | Only include package names in list (e.g. `express,vue`)       |
| `--exclude-package <list>` | Exclude package names (e.g. `left-pad,lodash`)                |
| `--with-license-text`      |                                                               |

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

## 🧩 Programmatic Usage (API)

You can also use `thanks-to` as a Node.js/TypeScript library:

### Example

```ts
import { generateThanksData, exportReports } from 'thanks-to';

async function main() {
  const data = await generateThanksData({
    dev: true,
    transitive: false,
  });

  await exportReports(data, ['json', 'md'], './credits');
}
```

### Types

```ts
export interface GenerateOptions {
  dev?: boolean;
  transitive?: boolean;
}

export function generateThanksData(options: GenerateOptions): Promise<GroupedDeps>;

export function exportReports(
  data: GroupedDeps,
  formats: ('json' | 'md' | 'html')[],
  outputDir: string
): Promise<void>;
```

---

## 📁 Output

### Markdown (`credits.md`)

```md
# 📦 Thanks to Open Source

## Dependencies (Direct)
- [chalk](https://github.com/chalk/chalk) – MIT

## Dev Dependencies (Direct)
- [eslint](https://github.com/eslint/eslint) – MIT
```

---

### HTML (`credits.html`)

A clean, dark-mode-friendly HTML page you can embed in documentation or publish on GitHub Pages.

> Supports sectioning, clickable repo links, license info, and more.

---

### JSON (`credits.json`)

Machine-readable output with structure:

```json
{
  "dependencies": {
    "direct": [
      {
        "name": "chalk",
        "version": "5.3.0",
        "license": "MIT",
        "repository": {
		   "url": "https://www.npmjs.com/package/chalk",
		   "git": "https://github.com/chalk/chalk"
		}
      }
    ],
    "transitive": [...]
  },
  "devDependencies": {
    "direct": [...],
    "transitive": [...]
  }
}
```

---

## 🧠 Why use this?

- ❤️ Add credit to the open-source community
- 📑 Show dependencies in published research or products
- 📃 Required for compliance in some orgs
- ✨ Just be a good human

---

## 📜 License

MIT © [Yuki](https://github.com/yukiakai212/)

---
