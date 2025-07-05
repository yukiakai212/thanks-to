import { describe, it, expect, beforeEach } from 'vitest';
import { generateThanksData } from '../src/index.ts';
import { CACHE_PKG } from '../src/extractor.ts';
import fs from 'fs';

describe('generateThanksData (integration)', () => {
  beforeEach(() => {
    CACHE_PKG.clear();
  });

  it('should generate default (direct dependencies)', async () => {
    const data = await generateThanksData({});
    expect(data.dependencies.direct.length).toBeGreaterThanOrEqual(0);
  });

  it('should include devDependencies when specified', async () => {
    const data = await generateThanksData({ only: 'devDeps' });
    expect(data.devDependencies.direct.length).toBeGreaterThanOrEqual(0);
  });

  it('should include transitive when enabled', async () => {
    const data = await generateThanksData({ transitive: true });
    expect(data.dependencies.transitive).toBeDefined();
  });

  it('should filter by license (e.g. only MIT)', async () => {
    const data = await generateThanksData({ onlyLicense: ['mit'] });
    const all = [
      ...data.dependencies.direct,
      ...data.dependencies.transitive,
      ...data.devDependencies.direct,
      ...data.devDependencies.transitive,
    ];
    for (const pkg of all) {
      expect(pkg.license?.toLowerCase()).toBe('mit');
    }
  });

  it('should exclude license (e.g. mit)', async () => {
    const data = await generateThanksData({ excludeLicense: ['mit'] });
    const all = [
      ...data.dependencies.direct,
      ...data.dependencies.transitive,
      ...data.devDependencies.direct,
      ...data.devDependencies.transitive,
    ];
    for (const pkg of all) {
      expect(pkg.license?.toLowerCase()).not.toBe('mit');
    }
  });

  it('should include only selected packages (e.g. glob)', async () => {
    const data = await generateThanksData({ includePackage: ['glob'] });
    const names = [
      ...data.dependencies.direct,
      ...data.dependencies.transitive,
      ...data.devDependencies.direct,
      ...data.devDependencies.transitive,
    ].map((x) => x.name);
    expect(names.every((n) => n === 'glob')).toBe(true);
  });

  it('should exclude selected packages (e.g. glob)', async () => {
    const data = await generateThanksData({ excludePackage: ['glob'] });
    const names = [
      ...data.dependencies.direct,
      ...data.dependencies.transitive,
      ...data.devDependencies.direct,
      ...data.devDependencies.transitive,
    ].map((x) => x.name);
    expect(names.some((n) => n === 'glob')).toBe(false);
  });
  it('should contains license content', async () => {
    const data = await generateThanksData({ withLicenseText: true });
    expect(data.dependencies.direct.find((x) => x.licenseContent)).toBeTruthy();
  });
});
