'use strict';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import correct from 'spdx-correct';
import resolvePkg from 'resolve-pkg';
import { globSync } from 'glob';

import { GroupedDeps, PackageInfo } from './types';

export const PACKAGE_FILE_NAME = 'package.json';
export const CACHE_PKG = new Map<string, Object>();
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
    } catch (e) {
      continue;
    }
  }

  return undefined;
}

export function resolveSourceList(list, options): PackageInfo[] {
  const pkgs = [];
  for (let pkg of list) {
    const pkgResource = resolveSource(pkg, options);
    if (pkgResource) pkgs.push(pkgResource);
  }
  return pkgs;
}
export function resolveSource(packageName, options): PackageInfo | null {
  const getPkg = (name, options) => {
    const cachePkg = CACHE_PKG.get(name);
    if (cachePkg) return cachePkg;
    const modulePath = resolvePkg(name);
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
        license: correct(pkg?.license) || 'Unknow',
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
export function getDirectDeps(packageFile: string | null): GroupedDeps | null {
  const pkgPath = packageFile || path.resolve(process.cwd(), PACKAGE_FILE_NAME);
  if (!fs.existsSync(pkgPath)) {
    const nextSearchPkgPath = path.join(process.cwd(), '..', PACKAGE_FILE_NAME);
    return nextSearchPkgPath !== pkgPath ? getDirectDeps(nextSearchPkgPath) : null;
  }
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  return {
    dependencies: pkg.dependencies ? Object.keys(pkg.dependencies) : [],
    devDependencies: pkg.devDependencies ? Object.keys(pkg.devDependencies) : [],
  };
}

export function getNpmTreeRaw() {
  return execSync('npm ls --json --all', { encoding: 'utf8' });
}
