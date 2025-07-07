import path from 'node:path';
import correct from 'spdx-correct';
import _ from 'lodash';
import { findUp } from '@yukiakai/find-up';
import { globSync } from 'glob';
import { GroupedDeps, Options } from './types.js';
import { getDirectDeps, getNpmTreeRaw, resolveSourceList, CACHE_PKG } from './extractor.js';
import { walkTree } from './tree.js';
import { exportReports } from './exporter.js';

export { exportReports };
function correctOptions(options): Options {
  const formatedOption: Options = {
    dir: path.resolve(options.dir || '.'),
    monoRepo: options.monoRepo || false,
    transitive: options?.transitive || false,
    withLicenseText: options?.withLicenseText || false,
    only: options?.only || 'all',
    onlyLicense:
      typeof options.onlyLicense === 'string'
        ? options.onlyLicense.split(',').map((x) => correct(x) || 'Unknow')
        : options.onlyLicense,
    excludeLicense:
      typeof options.excludeLicense === 'string'
        ? options.excludeLicense.split(',').map((x) => correct(x) || 'Unknow')
        : options.excludeLicense,
    includePackage:
      typeof options.includePackage === 'string'
        ? options.includePackage.split(',')
        : options.includePackage,
    excludePackage:
      typeof options.excludePackage === 'string'
        ? options.excludePackage.split(',')
        : options.excludePackage,
  };
  return formatedOption;
}
export const defaultOptions = correctOptions({});
export function classifyDependencies(
  options: Options,
  workspace: string,
  cache: boolean = true,
): GroupedDeps {
  if (!cache) CACHE_PKG.clear();
  const groups: GroupedDeps = {
    dependencies: {
      direct: [],
      transitive: [],
    },
    devDependencies: {
      direct: [],
      transitive: [],
    },
  };
  const direct = getDirectDeps(workspace);
  if (!direct) return groups;
  const npmTreeRaw = getNpmTreeRaw(workspace);
  const npmTree = JSON.parse(npmTreeRaw);

  if (['all', 'deps'].includes(options.only)) {
    groups.dependencies.direct = resolveSourceList(direct.dependencies, options);
    groups.dependencies.transitive = options.transitive
      ? walkTree(npmTree, direct.dependencies, options)
      : [];
  }
  if (['all', 'devDeps'].includes(options.only)) {
    groups.devDependencies.direct = resolveSourceList(direct.devDependencies, options);
    groups.devDependencies.transitive = options.transitive
      ? walkTree(npmTree, direct.devDependencies, options)
      : [];
  }

  return groups;
}
export function classifyDependenciesMonoRepo(
  options: Options,
  workspace: string,
  cache: boolean = true,
): GroupedDeps {
  const patterns = ['apps/**', 'packages/**'];
  let thanksAll: GroupedDeps;
  console.log(thanksAll);
  const apps = globSync(
    patterns.map((p) => path.posix.join(workspace, p)),
    { nocase: true, absolute: true },
  );
  for (const app of apps) {
    try {
      const thanks: GroupedDeps = classifyDependencies(options, app, cache);
      if (!thanksAll) {
        thanksAll = thanks;
        continue;
      }
      thanksAll.dependencies.direct = _.unionBy(
        thanksAll.dependencies.direct,
        thanks.dependencies.direct,
        'name',
      );
      thanksAll.dependencies.transitive = _.unionBy(
        thanksAll.dependencies.transitive,
        thanks.dependencies.transitive,
        'name',
      );
      thanksAll.devDependencies.direct = _.unionBy(
        thanksAll.devDependencies.direct,
        thanks.devDependencies.direct,
        'name',
      );
      thanksAll.devDependencies.transitive = _.unionBy(
        thanksAll.devDependencies.transitive,
        thanks.devDependencies.transitive,
        'name',
      );
    } catch {
      continue;
    }
  }
  return thanksAll;
}
export default async function thanksTo(options, report, output): Promise<void> {
  const thanksData = await generateThanksData(options);
  await exportReports(thanksData, report, output);
}
export async function generateThanksData(
  options?: object,
  cache: boolean = true,
): Promise<GroupedDeps | undefined> {
  const optsCorrected = correctOptions(options);
  const workspace = findUp('package.json', { basedir: optsCorrected.dir });
  const thanks = optsCorrected.monoRepo
    ? classifyDependenciesMonoRepo(optsCorrected, workspace, cache)
    : classifyDependencies(optsCorrected, workspace, cache);
  return thanks;
}
