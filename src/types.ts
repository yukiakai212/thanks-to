'use strict';

export type PackageInfo = {
  name: string;
  version: string;
  license: string;
  licenseContent?: string;
  description?: string;
  author?: string | object;
  repository?: { url: string; git?: string };
  via?: string[];
};

export type DependencyGroup = {
  direct: PackageInfo[];
  transitive: PackageInfo[];
};

export type GroupedDeps = {
  dependencies: DependencyGroup;
  devDependencies: DependencyGroup;
};
export interface Options {
  report: ('json' | 'md' | 'html' | 'csv')[];
  transitive: boolean;
  withLicenseText: boolean;
  only: 'all' | 'deps' | 'devDeps';
  onlyLicense?: string[] | null;
  excludeLicense?: string[] | null;
  includePackage?: string[] | null;
  excludePackage?: string[] | null;
  output: string;
}
