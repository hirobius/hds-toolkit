#!/usr/bin/env node
/**
 * hds-mcp — the `hds` MCP server over stdio, shipped in @hirobius/hds-toolkit.
 *
 * Run from an app that has @hirobius/design-system and this package installed:
 *   npx hds-mcp
 *
 * The tools come from this package (catalog, guide, server); the data they read
 * (component-api.json, hds-manifest.json, the /patterns names) comes from the
 * installed @hirobius/design-system. It never touches the network or the
 * caller's files. Newline-delimited JSON-RPC 2.0 on stdio; logs go to stderr.
 */
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { createInterface } from 'node:readline';
import { loadCatalog } from './catalog.mjs';
import { createServer } from './server.mjs';

const require = createRequire(import.meta.url);
const { version } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

let catalog;
try {
  const dataRoot = dirname(require.resolve('@hirobius/design-system/package.json'));
  catalog = loadCatalog(dataRoot);
} catch (err) {
  console.error(
    `hds-mcp: could not read the design-system data (${err.message}).\n` +
      '  Install @hirobius/design-system next to @hirobius/hds-toolkit (it is a peer dependency).',
  );
  process.exit(1);
}

const handle = createServer({ version, instructions: catalog.instructions, tools: catalog.tools });
const send = (msg) => process.stdout.write(`${JSON.stringify(msg)}\n`);

createInterface({ input: process.stdin }).on('line', (line) => {
  if (!line.trim()) return;
  let message;
  try {
    message = JSON.parse(line);
  } catch {
    send({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } });
    return;
  }
  const response = handle(message);
  if (response) send(response);
});
