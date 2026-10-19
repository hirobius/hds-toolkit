#!/usr/bin/env node
/** Refuses a publish that has not been synced from hds (see scripts/sync-from-hds.mjs). */
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const here = resolve(import.meta.dirname, '..');
const needed = ['SYNCED_FROM.json', 'eslint-plugin/index.mjs', 'mcp/catalog.mjs', 'AGENTS.md', 'llms-full.txt', 'llms'];
const missing = needed.filter((p) => !existsSync(join(here, p)));
if (missing.length) {
  console.error(`not synced: missing ${missing.join(', ')}. Run: node scripts/sync-from-hds.mjs <path-to-hds>`);
  process.exit(1);
}
