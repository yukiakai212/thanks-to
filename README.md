# 📦 thanks-to

[![NPM Version][npm-version-image]][npm-url]
[![NPM Downloads][npm-downloads-image]][npm-downloads-url]

[![Build Status][github-build-url]][github-url]
[![codecov][codecov-image]][codecov-url]

> Generate beautiful acknowledgments for your project's dependencies.  
> Perfect for open source credits, docs, audit reports, or legal compliance.

---

## ✨ Features

- ✅ Auto-detect `dependencies` and `devDependencies`
- ✅ Separate `direct` and `transitive` dependencies
- ✅ Export to Markdown, JSON, CSV, and HTML
- ✅ Filter by license name or package
- ✅ Optional: Include full license content per package
- ✅ Works via CLI or programmatic API

---

## 📦 Installation

```bash
npm install --save-dev thanks-to
```

Or run directly without install:

```bash
npx thanks-to
```

---

## 🚀 CLI Usage

```bash
npx thanks-to [options]
```

### Options

| Option                     | Description                                                   | Default          |
| -------------------------- | ------------------------------------------------------------- |----------------- |
| `--help`                   | Show usage instructions and available options                 | -                |
| `--transitive`             | Include transitive (indirect) dependencies                    | false            |
| `--report <types>`         | Export formats: `json,md,csv,html` (comma-separated)          | json,md,csv,html |
| `--output <dir>`           | Custom output folder                                          | `./thanks-to`    |  
| `--silent`                 | Suppress logs                                                 | false            |
| `--only <group>`           | `deps`, `devDeps`, or `all` – choose which group to include   | deps             |
| `--only-license <list>`    | Only include licenses in list (e.g. `mit,apache`)             | -                |
| `--exclude-license <list>` | Exclude licenses (e.g. `gpl,agpl`)                            | -                |
| `--include-package <list>` | Only include package names in list (e.g. `express,vue`)       | -                |
| `--exclude-package <list>` | Exclude package names (e.g. `left-pad,lodash`)                | -                |
| `--with-license-text`      | Include full license text from packages if available          | false            |

---

### Examples

```bash
# Export default deps into all formats
npx thanks-to

# Export only markdown
npx thanks-to --report md

# Include devDependencies and transitive packages
npx thanks-to --only all --transitive

# Only include MIT or Apache licensed packages
npx thanks-to --only-license mit,apache

# Exclude GPL or AGPL licensed packages
npx thanks-to --exclude-license gpl,agpl

# Only include express and chalk
npx thanks-to --include-package express,chalk

# Export only devDependencies to JSON
npx thanks-to --only devDeps --report json

# Include license text and export as HTML
npx thanks-to --with-license-text --report html

# Export into docs folder
npx thanks-to --output ./docs/credits
```

---

## 🧩 API Usage

You can use `thanks-to` in both ESM and CommonJS environments.

### ✅ ESM

```ts
import { generateThanksData, exportReports } from 'thanks-to';

const data = await generateThanksData({ transitive: true });
await exportReports(data, ['md'], './output');
```

### ✅ CommonJS

```js
const { generateThanksData, exportReports } = require('thanks-to');

(async () => {
  const data = await generateThanksData({ transitive: true });
  await exportReports(data, ['md'], './output');
})();
```

If you're using TypeScript, the library automatically infers types from exported definitions.

---

### API Options

```ts
Options {
  report: string['html' | 'csv' | 'json' | 'md'];
  transitive: boolean;
  withLicenseText: boolean;
  only: 'all' | 'deps' | 'devDeps';
  onlyLicense?: string[] | null;
  excludeLicense?: string[] | null;
  includePackage?: string[] | null;
  excludePackage?: string[] | null;
  output: string;
}
```

You can pass these options into `generateThanksData()` or into a wrapper function if building a programmatic tool. The `report` option is typically used with `exportReports()` to control the file formats written.

---

## 📁 Output Formats

### ✅ Markdown (`credits.md`)

```md
# 📦 Thanks to Open Source

## Dependencies (Direct)
- [express](https://github.com/expressjs/express) – MIT

## DevDependencies (Direct)
- [eslint](https://github.com/eslint/eslint) – MIT
```

### ✅ CSV (`credits.csv`)

```csv
name,version,license,repository.url,via,type
chalk,5.3.0,MIT,https://github.com/chalk/chalk,,dependencies
eslint,8.56.0,MIT,https://github.com/eslint/eslint,,devDependencies
```

### ✅ JSON (`credits.json`)

Structured data grouped by type (`direct`, `transitive`):

```json
{
  "dependencies": {
    "direct": [
      {
        "name": "express",
        "version": "4.18.2",
        "license": "MIT",
        "repository": {
		   "url": "https://www.npmjs.com/package/chalk",
		   "git": "https://github.com/chalk/chalk"
		}
        "licenseContent": "..." // if --with-license-text used
      }
    ]
  }
}
```

### ✅ HTML (`credits.html`)

Clean, dark-mode friendly HTML with links, license names and full license content (optional).

---

## 🧠 Use case

- ❤️ Add credit to the open-source community
- 📑 Show dependencies in published research or products
- 📃 Required for compliance in some orgs
- ✨ Just be a good human

---

## 📜 License

MIT © [Yuki](https://github.com/yukiakai212/)

---


[npm-downloads-image]: https://badgen.net/npm/dm/thanks-to
[npm-downloads-url]: https://www.npmjs.com/package/thanks-to
[npm-url]: https://www.npmjs.com/package/thanks-to
[npm-version-image]: https://badgen.net/npm/v/thanks-to
[github-build-url]: https://github.com/yukiakai212/thanks-to/actions/workflows/build.yml/badge.svg
[github-url]: https://github.com/yukiakai212/thanks-to/
[codecov-image]: https://codecov.io/gh/yukiakai212/thanks-to/branch/main/graph/badge.svg
[codecov-url]: https://codecov.io/gh/yukiakai212/thanks-to
