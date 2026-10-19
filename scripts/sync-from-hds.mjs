#!/usr/bin/env node
/**
 * Copies the private tooling out of an hds checkout into this package.
 *
 *   node scripts/sync-from-hds.mjs <path-to-hds-checkout>
 *
 * hds stays the source of truth (its generators write AGENTS.md and the llms
 * files from its own data); this repo only packages and publishes them. The
 * MCP entry point (mcp/hds-mcp.mjs) is owned here, not copied: it reads the
 * design-system data from the installed @hirobius/design-system package.
 * The rule tests stay in hds next to the rule source; this repo smoke-tests
 * the packaged result (test/). Writes SYNCED_FROM.json (hds commit + version) so a publish names its source.
 */
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const hds = process.argv[2] && resolve(process.argv[2]);
if (!hds || !existsSync(join(hds, 'mcp/catalog.mjs'))) {
  console.error('usage: node scripts/sync-from-hds.mjs <path-to-hds-checkout> (no mcp/catalog.mjs there)');
  process.exit(2);
}
const here = resolve(import.meta.dirname, '..');

/** [from (in hds), to (here)] — directories are replaced whole. */
const COPIES = [
  ['scripts/eslint-plugin-hds/index.mjs', 'eslint-plugin/index.mjs'],
  ['scripts/eslint-plugin-hds/index.d.mts', 'eslint-plugin/index.d.mts'],
  ['scripts/eslint-plugin-hds/rules', 'eslint-plugin/rules'],
  ['scripts/eslint-plugin-hds/package.json', 'eslint-plugin/package.json'],
  ['scripts/eslint-plugin-hds/README.md', 'eslint-plugin/README.md'],
  ['mcp/catalog.mjs', 'mcp/catalog.mjs'],
  ['mcp/core-set.mjs', 'mcp/core-set.mjs'],
  ['mcp/guide.mjs', 'mcp/guide.mjs'],
  ['mcp/server.mjs', 'mcp/server.mjs'],
  ['AGENTS.md', 'AGENTS.md'],
  ['public/llms-full.txt', 'llms-full.txt'],
  ['public/llms', 'llms'],
];

for (const [from, to] of COPIES) {
  const src = join(hds, from);
  if (!existsSync(src)) {
    console.error(`sync: ${from} is missing in ${hds}`);
    process.exit(1);
  }
  rmSync(join(here, to), { recursive: true, force: true });
  cpSync(src, join(here, to), { recursive: true });
}

const commit = execFileSync('git', ['-C', hds, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const { version } = JSON.parse(readFileSync(join(hds, 'package.json'), 'utf8'));
writeFileSync(join(here, 'SYNCED_FROM.json'), `${JSON.stringify({ hdsCommit: commit, hdsVersion: version }, null, 2)}\n`);
console.log(`synced ${COPIES.length} paths from hds ${version} (${commit.slice(0, 7)})`);
