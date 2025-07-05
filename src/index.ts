import correct from 'spdx-correct';
import { GroupedDeps, Options } from './types.js';
import { getDirectDeps, getNpmTreeRaw, resolveSourceList } from './extractor.js';
import { walkTree } from './tree.js';
import { exportReports } from './exporter.js';

export { exportReports };
function correctOptions(options): Options {
  const formatedOption: Options = {
    report:
      typeof options.report === 'string'
        ? options.report.split(',')
        : options.report || ['html', 'json', 'md', 'csv'],
    transitive: options?.transitive || false,
    withLicenseText: options?.withLicenseText || false,
    only: options?.only || 'deps',
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
export async function thanksTo(options): Promise<void> {
  const thanksData = await generateThanksData(options);
  await exportReports(thanksData, options.report, options.output);
}
export async function generateThanksData(options): Promise<GroupedDeps> {
  const optsCorrected = correctOptions(options);
  const result = classifyDependencies(optsCorrected);
  return result;
}
