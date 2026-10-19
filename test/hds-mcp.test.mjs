// @vitest-environment node
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const bin = fileURLToPath(new URL('../mcp/hds-mcp.mjs', import.meta.url));

/** Sends newline-delimited JSON-RPC to the stdio server and returns the parsed responses. */
function rpc(messages) {
  const input = messages.map((m) => JSON.stringify(m)).join('\n') + '\n';
  const res = spawnSync(process.execPath, [bin], { input, encoding: 'utf8', timeout: 15000 });
  expect(res.status, res.stderr).toBe(0);
  return res.stdout.trim().split('\n').filter(Boolean).map((l) => JSON.parse(l));
}

describe('hds-mcp (toolkit entry point, data from the installed design system)', () => {
  it('initializes and lists tools', () => {
    const [init, list] = rpc([
      { jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 't', version: '0' } } },
      { jsonrpc: '2.0', id: 2, method: 'tools/list' },
    ]);
    expect(init.result.serverInfo.version).toBe('0.1.0');
    expect(list.result.tools.length).toBeGreaterThan(0);
  });
});
