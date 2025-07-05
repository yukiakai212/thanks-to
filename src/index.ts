import { GroupedDeps, PackageInfo } from './types';
import { getDirectDeps, getNpmTreeRaw, resolveSourceList, resolveSource } from './extractor';
import { Tree, walkTree } from './tree';

function classifyDependencies(options?: any): GroupedDeps {
  const direct = getDirectDeps();
  console.log(options);
  // return resolveOutput((direct, options));

  const npmTreeRaw = getNpmTreeRaw();
  const npmTree = JSON.parse(npmTreeRaw);

  const groups: GroupedDeps = {
    dependencies: {
      direct: resolveSourceList(direct.dependencies),
      transitive: options.transitive ? walkTree(npmTree, direct.dependencies) : [],
    },
    devDependencies: {
      direct: options.dev ? resolveSourceList(direct.devDependencies) : [],
      transitive:
        options.transitive && options.dev ? walkTree(npmTree, direct.devDependencies) : [],
    },
  };
  console.log(JSON.stringify(groups));

  return groups;
}

// Entry point
const result = classifyDependencies({ dev: true, transitive: true });
//console.log(JSON.stringify(result, null, 2));
