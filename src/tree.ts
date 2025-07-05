'use strict';
import { PackageInfo } from './types.js';
import { resolveSource } from './extractor.js';
import { Filter } from './filter.js';

export function walkTree(npmTree, nameList, options): PackageInfo[] {
  const tree = new Tree(options);
  for (const node of nameList) {
    const parentNode = npmTree.dependencies[node];
    if (!parentNode.dependencies) continue;
    for (const chillNode of Object.keys<string>(parentNode.dependencies)) {
      tree.walk(parentNode, chillNode, node);
    }
  }
  return Array.from(tree.acc.values());
}
export class Tree {
  acc: Map<string, PackageInfo> = new Map();
  visited = new Set<string>();
  options = null;

  constructor(options) {
    this.options = options;
    this.filter = new Filter(this.options);
  }

  walk(node, name, parentName) {
    if (!node || typeof node !== 'object' || !node.dependencies) return;
    const key = `${name}@${node.version}`;
    if (this.visited.has(key)) return;
    this.visited.add(key);
    if (this.filter.isFilteredPackage(name)) return;
    if (!this.acc.has(key)) {
      const pkg = resolveSource(name, this.options);
      if (!pkg) return;
      if (this.filter.isFilteredLicense(pkg)) return;
      this.acc.set(key, {
        ...pkg,
        ...{
          via: parentName ? [parentName] : [],
        },
      });
    } else if (parentName) {
      this.acc.get(key).via.push(parentName);
    }

    if (node.dependencies) {
      for (const dep of Object.keys<string>(node.dependencies)) {
        this.walk(node.dependencies[dep], dep, name);
      }
    }
  }
}
