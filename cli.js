#!/usr/bin/env node
import { Command } from 'commander';
import path from 'path';
import fs from 'fs';
import { generateThanksData } from './dist/index.js';

const program = new Command();

program
  .name('thanks-to')
  .description('Generate credits for open-source dependencies')
  .option('--only <group>', '[deps|devDeps|all] – choose which group to include', 'deps')
  .option('--transitive', 'Include transitive (indirect) dependencies')
  .option('--report <formats>', 'Output formats (comma-separated: json,md,csv,html)', 'csv,json,md,html')
  .option('--output <dir>', 'Output directory', './thanks-to')
  .option('--only-license <list>', 'Only include licenses in list (e.g. mit,apache)')
  .option('--exclude-license <list>', 'Exclude licenses (e.g. gpl,agpl)')
  .option('--include-package <list>', 'Only include package names in list (e.g. express,vue)')
  .option('--exclude-package <list>', 'Exclude package names (e.g. left-pad,lodash)')
  .option('--with-license-text', 'include text license')
  .option('--silent', 'Suppress logs');

program.parse(process.argv);

const options = program.opts();

// Parse report formats
const formats = options.report.split(',').map(f => f.trim().toLowerCase());

// Run core logic
(async () => {
  if (!options.silent) {
    console.log('📦 Generating thanks-to report...');
    console.log(`• Group: ${!!options.only}`);
    console.log(`• Include transitive deps: ${!!options.transitive}`);
    console.log(`• With license text: ${!!options.withLicenseText}`);
    console.log(`• Output formats: ${formats.join(', ')}`);
    console.log(`• Output directory: ${options.output}`);
  }

  const data = await generateThanksData(options);



  
    console.log(`✅ Exported reports to ${options.output}`);
  
})();
