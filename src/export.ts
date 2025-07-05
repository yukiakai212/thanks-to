'use strict';
import { json2csv } from 'json-2-csv';
import fs from 'fs';
import path from 'path';
import { GroupedDeps, Options } from './types';

export async function exportToCSV(data) {
  const options = {
    keys: ['name', 'version', 'license', 'author', 'repository.url', 'via', 'type'],
    unwindArrays: true,
    emptyFieldValue: '',
  };
  data.dependencies.direct.map((x) => (x.type = 'dependencies'));
  data.dependencies.transitive.map((x) => (x.type = 'dependencies'));
  data.devDependencies.direct.map((x) => (x.type = 'devDependencies'));
  data.devDependencies.transitive.map((x) => (x.type = 'devDependencies'));
  return await json2csv(
    [
      ...data.dependencies.direct,
      ...data.dependencies.transitive,
      ...data.devDependencies.direct,
      ...data.devDependencies.transitive,
    ],
    options,
  );
}
export async function reportToFile(data: GroupedDeps, options: Options) {
  if (!fs.existsSync(options.output)) fs.mkdirSync(options.output, { recursive: true });
  const reportFolder = path.join(options.output, 'credits');
  if (options.report.includes('csv')) {
    const outputData = await exportToCSV(data);
    fs.writeFileSync(reportFolder + '.csv', outputData);
  }
  if (options.report.includes('html')) {
    const outputData = generateHtml(data);
    fs.writeFileSync(reportFolder + '.html', outputData);
  }
  if (options.report.includes('md')) {
    const outputData = generateMarkdown(data);
    fs.writeFileSync(reportFolder + '.md', outputData);
  }
  if (options.report.includes('json')) {
    const outputData = JSON.stringify(data);
    fs.writeFileSync(reportFolder + '.json', outputData);
  }
}
function generateMarkdown(data: GroupedDeps): string {
  let md = `# Thanks to Open Source\n\n`;

  const section = (title: string, deps: typeof data.dependencies.direct) => {
    if (!deps.length) return '';
    return (
      `## ${title}\n` +
      deps
        .map((dep) => {
          const url = (dep.repository.git || dep.repository.url) ?? '';
          return `- [${dep.name}](${url}) – ${dep.license || 'Unknown'}${dep.via ? ` (via: ${dep.via.join(', ')})` : ''}`;
        })
        .join('\n') +
      '\n\n'
    );
  };

  md += section('Dependencies (Direct)', data.dependencies.direct);
  md += section('Dependencies (Transitive)', data.dependencies.transitive);
  md += section('DevDependencies (Direct)', data.devDependencies.direct);
  md += section('DevDependencies (Transitive)', data.devDependencies.transitive);

  return md;
}

export function generateHtml(data: GroupedDeps): string {
  const section = (title: string, deps: GroupedDeps['dependencies']['direct']) => {
    if (!deps.length) return '';
    return `
    <section>
      <h2>${title}</h2>
      <ul>
        ${deps
          .map(
            (d) => `
          <li>
            <a href="${d.repository.git || d.repository.url || ''}" target="_blank" rel="noopener">
              ${d.name}@${d.version}
            </a>
            <span class="license">– ${d.license || 'Unknown'}</span>
            ${d.via?.length ? `<span class="via">(via: ${d.via.join(', ')})</span>` : ''}
          </li>
        `,
          )
          .join('')}
      </ul>
    </section>
  `;
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Thanks to Open Source</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    :root {
      color-scheme: light dark;
      --bg: #fff;
      --text: #111;
      --accent: #2563eb;
      --subtle: #6b7280;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #111;
        --text: #eee;
        --accent: #3b82f6;
        --subtle: #9ca3af;
      }
    }
    body {
      font-family: 'Segoe UI', sans-serif;
      background: var(--bg);
      color: var(--text);
      padding: 2rem;
      max-width: 800px;
      margin: auto;
      line-height: 1.6;
    }
    h1 {
      font-size: 2rem;
      margin-bottom: 1.5rem;
    }
    h2 {
      margin-top: 2rem;
      color: var(--accent);
    }
    ul {
      list-style: none;
      padding-left: 0;
    }
    li {
      margin-bottom: 0.5rem;
    }
    a {
      color: var(--accent);
      text-decoration: none;
      font-weight: 600;
    }
    .license {
      margin-left: 0.3rem;
      color: var(--subtle);
    }
    .via {
      margin-left: 0.5rem;
      font-size: 0.9em;
      color: var(--subtle);
    }
    footer {
      margin-top: 4rem;
      font-size: 0.9em;
      color: var(--subtle);
      text-align: center;
    }
  </style>
</head>
<body>
  <h1>📦 Thanks to Open Source</h1>

  ${section('Runtime Dependencies (Direct)', data.dependencies.direct)}
  ${section('Runtime Dependencies (Transitive)', data.dependencies.transitive)}
  ${section('Dev Dependencies (Direct)', data.devDependencies.direct)}
  ${section('Dev Dependencies (Transitive)', data.devDependencies.transitive)}

  <footer>Generated with <a href="https://www.npmjs.com/package/thanks-to" target="_blank">thanks-to</a></footer>
</body>
</html>
`.trim();
}
