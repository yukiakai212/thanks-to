'use strict';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { GroupedDeps } from './types';

export function getDirectDeps(): GroupedDeps {
  const pkgPath = path.resolve(process.cwd(), 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  return {
    dependencies: pkg.dependencies ? Object.keys(pkg.dependencies) : [],
    devDependencies: pkg.devDependencies ? Object.keys(pkg.devDependencies) : [],
  };
}

export function getNpmTreeRaw() {
  return execSync('npm ls --json --all', { encoding: 'utf8' });
}
