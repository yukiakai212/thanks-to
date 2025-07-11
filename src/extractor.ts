'use strict';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import correct from 'spdx-correct';
import { resolvePath } from '@yukiakai/resolve-package';
import { globSync } from 'glob';

import { GroupedDeps, PackageInfo } from './types.js';
import { Filter } from './filter.js';

export const PACKAGE_FILE_NAME = 'package.json';
export const CACHE_PKG = new Map<string, object>();
export function readLicenseFile(packageRoot: string): string | undefined {
  const patterns = ['LICENSE*', 'LICENCE*', 'COPYING*'];

  const files = globSync(
    patterns.map((p) => path.posix.join(packageRoot, p)),
    { nocase: true, absolute: true },
  );
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      return content;
    } catch {
      continue;
    }
  }

  return undefined;
}

export function resolveSourceList(list, options): PackageInfo[] {
  const pkgs = [];
  const filter = new Filter(options);
  for (const pkg of list) {
    const pkgResource = resolveSource(pkg, options);
    if (pkgResource && !filter.isFilteredPackage(pkg) && !filter.isFilteredLicense(pkgResource))
      pkgs.push(pkgResource);
  }
  return pkgs;
}
export function resolveSource(packageName, options): PackageInfo | null {
  const getPkg = (name, options) => {
    const cachePkg = CACHE_PKG.get(name);
    if (cachePkg) return cachePkg;
    const modulePath = resolvePath(name);
    if (!modulePath) return console.warn('Cant found module:', name);
    const pkg = JSON.parse(fs.readFileSync(path.join(modulePath, PACKAGE_FILE_NAME), 'utf8'));
    pkg.licenseContent = options.withLicenseText ? readLicenseFile(modulePath) : null;
    CACHE_PKG.set(name, pkg);
    return pkg;
  };

  const pkg = getPkg(packageName, options);
  return pkg
    ? {
        name: pkg.name,
        version: pkg.version,
        author: pkg.author,
        license: pkg.license ? correct(pkg.license) : 'Unknow',
        licenseContent: pkg?.licenseContent,
        description: pkg?.description,
        repository: {
          url: 'https://www.npmjs.com/package/' + pkg.name,
          git: pkg?.repository?.url
            ?.replaceAll(/git\+|\.git/g, '')
            .replace(/git@github\.com:/, 'https://github.com/')
            .replace(/git:\/\//, 'https://')
            .replace(/ssh:\/\/git@/, 'https://'),
        },
      }
    : null;
}
export function getDirectDeps(packageFile: string): GroupedDeps | null {
  const pkgPath = path.resolve(path.join(packageFile, PACKAGE_FILE_NAME));
  if (!fs.existsSync(pkgPath)) return null;
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  return {
    dependencies: pkg.dependencies ? Object.keys(pkg.dependencies) : [],
    devDependencies: pkg.devDependencies ? Object.keys(pkg.devDependencies) : [],
  };
}

export function getNpmTreeRaw(dir: string) {
  return execSync('npm ls --json --all', { cwd: dir, encoding: 'utf8' });
}
export function getWorkspacePackage(packageRoot: string): string[] {
  const patterns = ['LICENSE*', 'LICENCE*', 'COPYING*'];

  const files = globSync(
    patterns.map((p) => path.posix.join(packageRoot, p)),
    { nocase: true, absolute: true },
  );
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      return content;
    } catch {
      continue;
    }
  }

  return undefined;
}
