'use strict';

export type PackageInfo = {
  name: string;
  version: string;
  license?: string;
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
