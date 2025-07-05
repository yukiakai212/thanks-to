import { describe, it, expect, vi, beforeEach, test } from 'vitest';
import module from 'node:module';
import path from 'node:path';

import * as vanipathCore from '../src/index.js';
import * as vanipathESM from '../dist/index.js';
const require = module.createRequire(import.meta.url);
const vanipathCJS = require('../dist/index.cjs');

describe.each([
  ['Core', vanipathCore],
  ['ESM', vanipathESM],
  ['CJS', vanipathCJS],
])('vanipath with (%s)', (name, vanipath) => {
  it('should return this file path', () => {
    expect(vanipath.filename()).toBe(import.meta.filename);
  });
  it('should return this folder path', () => {
    expect(vanipath.dirname()).toBe(import.meta.dirname);
  });
});
test('Module should work, not throw Eror', async () => {
  await import('../index.js');
  expect(true).toBe(true);
});
