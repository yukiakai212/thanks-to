import { describe, it, expect } from 'vitest';
import { exportToCSV } from '../src/export';

describe('exportToCSV', () => {
  const mockData = {
    dependencies: {
      direct: [
        {
          name: 'chalk',
          version: '5.3.0',
          license: 'MIT',
          author: 'Sindre Sorhus',
          repository: {
            url: 'https://www.npmjs.com/package/chalk',
            git: 'https://github.com/chalk/chalk',
          },
          via: [],
        },
      ],
      transitive: [],
    },
    devDependencies: {
      direct: [
        {
          name: 'eslint',
          version: '8.56.0',
          license: 'MIT',
          author: 'eslint team',
          repository: {
            url: 'https://www.npmjs.com/package/eslint',
            git: 'https://github.com/eslint/eslint',
          },
          via: [],
        },
      ],
      transitive: [],
    },
  };

  it('should generate valid CSV content with expected headers', async () => {
    const csv = await exportToCSV(mockData);
    expect(csv).toContain('name,version,license,author,repository.url,via,type');
    expect(csv).toContain(
      'chalk,5.3.0,MIT,Sindre Sorhus,https://www.npmjs.com/package/chalk,,dependencies',
    );
    expect(csv).toContain(
      'eslint,8.56.0,MIT,eslint team,https://www.npmjs.com/package/eslint,,devDependencies',
    );
  });
});
