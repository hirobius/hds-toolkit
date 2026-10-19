// @vitest-environment node
import { describe, expect, it } from 'vitest';
import plugin from '@hirobius/hds-toolkit/eslint-plugin';

describe('eslint-plugin export', () => {
  it('resolves through the package export and carries the rules and recommended config', () => {
    expect(Object.keys(plugin.rules)).toContain('no-raw-hex');
    expect(plugin.configs?.recommended).toBeTruthy();
  });
});
