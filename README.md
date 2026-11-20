# @hirobius/hds-toolkit

Tooling and agent docs for the Hirobius Design System. The design system itself is [`@hirobius/design-system`](https://www.npmjs.com/package/@hirobius/design-system).

| Path | What it is |
|---|---|
| `@hirobius/hds-toolkit/eslint-plugin` | The HDS ESLint plugin |
| `npx hds-mcp` | The `hds` MCP server. It reads its data from the installed `@hirobius/design-system`. |
| `AGENTS.md`, `llms-full.txt`, `llms/` | Agent docs |

## Install

```
npm install --save-dev @hirobius/hds-toolkit @hirobius/design-system
```

No `.npmrc` and no token. Both packages come from the public npm registry.

## Release

hds is the source of truth. This repo only packages files copied from it.

1. `node scripts/sync-from-hds.mjs <hds checkout at the release tag>` copies the plugin, the MCP tools and the agent docs, and records the hds commit in `SYNCED_FROM.json`.
2. Bump `version`, then run `pnpm test`.
3. Merge to `main`. On GitHub, open Actions > publish > Run workflow. The workflow runs the tests and publishes to npm with public access. Do not run `npm publish` by hand.

`mcp/hds-mcp.mjs` is owned here and is never overwritten by the sync.

## License

MIT. See `LICENSE`.
