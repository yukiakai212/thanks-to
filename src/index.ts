import correct from 'spdx-correct';
import { GroupedDeps, PackageInfo, Options } from './types.js';
import { getDirectDeps, getNpmTreeRaw, resolveSourceList, resolveSource } from './extractor.js';
import { Tree, walkTree } from './tree.js';
import { reportToFile } from './export.js';

function correctOptions(options): Options {
  const formatedOption: Options = {
    report: options?.report ? options.report.split(',') : ['html', 'json', 'md', 'csv'],
    transitive: options?.transitive || false,
    withLicenseText: options?.withLicenseText || false,
    only: options?.only || 'deps',
    onlyLicense: options?.onlyLicense
      ? options.onlyLicense.split(',').map((x) => correct(x) || 'Unknow')
      : null,
    excludeLicense: options?.excludeLicense
      ? options.excludeLicense.split(',').map((x) => correct(x) || 'Unknow')
      : null,
    includePackage: options?.includePackage ? options.includePackage.split(',') : null,
    excludePackage: options?.excludePackage ? options.excludePackage.split(',') : null,
    output: options?.output || './thanks-to',
  };
  return formatedOption;
}
export const defaultOptions = correctOptions({});
export function classifyDependencies(options?: Options): GroupedDeps {
  const direct = getDirectDeps(null);
  const npmTreeRaw = getNpmTreeRaw();
  const npmTree = JSON.parse(npmTreeRaw);
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

export async function generateThanksData(options: Options): Promise<GroupedDeps> {
  const optsCorrected = correctOptions(options);
  const result = classifyDependencies(optsCorrected);
  await reportToFile(result, optsCorrected);
  return result;
}
