# @hirobius/hds-toolkit (private)

The private half of the Hirobius Design System. It holds the tooling and agent docs; the design system itself stays public as `@hirobius/design-system`.

| Path | What it is |
|---|---|
| `@hirobius/hds-toolkit/eslint-plugin` | The HDS ESLint plugin (formerly `@hirobius/design-system/eslint-plugin`) |
| `npx hds-mcp` | The `hds` MCP server. It reads its data from the installed `@hirobius/design-system`. |
| `AGENTS.md`, `llms-full.txt`, `llms/` | Agent docs |

Published to **GitHub Packages** (`npm.pkg.github.com`), not npm. It came out of the HDS re-tier, hirobius/ops#691.

## Install (consumer)

`.npmrc`:

```
@hirobius:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${HDS_PACKAGES_TOKEN}
```

`HDS_PACKAGES_TOKEN` is a classic token with `read:packages`. The scope line sends every `@hirobius/*` package to GitHub Packages, so `@hirobius/design-system` is mirrored there on each release too.

## Release

hds is the source of truth. This repo only packages files copied from it.

1. `node scripts/sync-from-hds.mjs <hds checkout at the release tag>` copies the plugin, the MCP tools and the agent docs, and records the hds commit in `SYNCED_FROM.json`.
2. Bump `version`, then run `pnpm test`.
3. `NODE_AUTH_TOKEN=$HDS_PACKAGES_WRITE_TOKEN pnpm publish`. `prepublishOnly` refuses an unsynced tree.

`mcp/hds-mcp.mjs` is owned here and is never overwritten by the sync.
