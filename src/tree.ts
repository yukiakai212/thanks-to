'use strict';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { GroupedDeps, PackageInfo } from './types';
import { resolveSource } from './extractor';

export function walkTree(npmTree, nameList): PackageInfo[] {
  const tree = new Tree();
  for (let node of nameList) {
    const parentNode = npmTree.dependencies[node];
    if (!parentNode.dependencies) continue;
    for (let chillNode of Object.keys<string>(parentNode.dependencies)) {
      tree.walk(parentNode, chillNode, node);
    }
  }
  return Array.from(tree.acc.values());
}
export class Tree {
  acc: Map<string, PackageInfo> = new Map();
  visited = new Set<string>();

  walk(node, name, parentName) {
    if (!node || typeof node !== 'object' || !node.dependencies) return;
    const key = `${name}@${node.version}`;
    if (this.visited.has(key)) return;
    this.visited.add(key);
    if (!this.acc.has(key)) {
      const pkg = resolveSource(name);
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
