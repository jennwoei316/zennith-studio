<div align="center">

# 🎨 Zennith Studio

**Brand-aligned design generation for Zennith OS — soft-fork of [open-design](https://github.com/nexu-io/open-design).**

Multi-brand creative pipeline: HTML / decks / landing pages / dashboards generated from natural-language briefs, scoped to each brand's design system + voice + DNA.

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Upstream](https://img.shields.io/badge/Upstream-nexu--io%2Fopen--design-green)](https://github.com/nexu-io/open-design)
[![Pattern](https://img.shields.io/badge/Pattern-3%20overlay-orange)](NOTICE.zennith.md)

</div>

## What this is

Zennith Studio is **the visual layer for Zennith OS** — a multi-brand AI agent operating system running 4 agents (zenni, taoz, dreami, scout) across 7 brands (Pinxin Vegan, MIRRA, Jade Oracle, Dr Stan, Rasaya, Wholey Wonder, Kyochon).

Built on top of [open-design](https://github.com/nexu-io/open-design) using Pattern 3 (soft-fork + isolated overlay) so monthly upstream merges cost ~30 min not ~8 hours.

## Quick start

```bash
git clone https://github.com/jennwoei316/zennith-studio.git
cd zennith-studio
pnpm install
pnpm tools-dev start web
open http://localhost:5175
```

Daemon: `od dev` (dev mode) · `od start` (prod). Web at port 5175.

## Architecture

| Layer | Path | Purpose |
|---|---|---|
| Upstream daemon | `apps/daemon/` | Untouched. Skills loader, design-systems loader, sandbox preview. |
| Upstream web | `apps/web/` | Untouched (except `layout.tsx` title). Streaming UI + sandboxed preview iframes. |
| **Zennith overlay** | `apps/zennith/` | Our hooks, exports (Klaviyo, Shopify), adapters (Hermes profiles), prompts, themes. |
| Brand design systems | `design-systems/{pinxin-vegan,mirra,jade-oracle,dr-stan,rasaya}/` | Symlinks to `~/.openclaw/brands/<brand>/DESIGN.md`. |
| Upstream skills | `skills/*/` | Untouched. |
| Zennith skills | `skills/zennith-*/` | Prefix-namespaced additions (e.g. `zennith-brand-mood`, `zennith-ad-id-mint`). |

## Differences from upstream

- 7-brand design-system mounting (vs upstream's 71 brand examples)
- Hooks for `artifact-bus`, `ad-id-mint`, `calibration-gate`
- Re-themed UI (Zennith Studio brand)
- Re-skinned README + package.json

See [NOTICE.zennith.md](NOTICE.zennith.md) for full attribution.

## Upstream sync

Monthly cadence per [ZENNITH-MERGE-PROTOCOL.md](ZENNITH-MERGE-PROTOCOL.md):

```bash
git fetch upstream
git merge upstream/main
# 5 predictable merge files: package.json, README.md, NOTICE.zennith.md, layout.tsx, og-image
pnpm install
pnpm tools-dev start web
curl -o /dev/null -w "%{http_code}\n" http://127.0.0.1:5175/  # → 200
```

## License

Apache-2.0 — same as upstream. See [LICENSE](LICENSE) and [NOTICE.zennith.md](NOTICE.zennith.md).

## Maintainers

- [@jennwoei316](https://github.com/jennwoei316) — Zennith OS / Gaia-eats
- Upstream: [nexu-io/open-design](https://github.com/nexu-io/open-design) (Apache-2.0)
