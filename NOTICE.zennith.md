# NOTICE — Zennith Studio Attribution

Zennith Studio is a soft-fork of [nexu-io/open-design](https://github.com/nexu-io/open-design) (Apache-2.0).

## Upstream
- **Project:** open-design v0.2.0
- **Authors:** nexu-io and contributors
- **License:** Apache-2.0 (preserved — see `LICENSE`)
- **Source:** https://github.com/nexu-io/open-design

## Architecture
Zennith Studio uses **Pattern 3 (soft-fork + isolated overlay)** per [zennith-skills/intel/FORK-UPDATE-STRATEGY-2026-05-01.md](https://github.com/jennwoei316/zennith-skills/blob/main/intel/FORK-UPDATE-STRATEGY-2026-05-01.md):

- **Upstream files (untouched):** `apps/daemon/*`, `apps/web/*` (except 5 listed below), `packages/*`, `skills/*` (upstream skills preserved)
- **Zennith additions (in `apps/zennith/`):** hooks, exports, adapters, prompts, themes
- **Zennith brand DESIGN.md (symlinked):** Pinxin Vegan, MIRRA, Jade Oracle, Dr Stan, Rasaya
- **Touched upstream files (predictable merge cost):** `package.json` (name + description), `README.md`, this NOTICE, `apps/web/src/app/layout.tsx` (title only), `apps/web/public/{favicon,og-image}` (when added)

## Upstream sync
Monthly `git fetch upstream && git merge upstream/main` per [ZENNITH-MERGE-PROTOCOL.md](ZENNITH-MERGE-PROTOCOL.md) (template TBD).

## Sponsor
Pending: GitHub Sponsors @ $50/mo to nexu-io after F1 ships (see fork-update-strategy §3 #7).

## Differences from upstream
- Adds Zennith brand design-systems (7 brands)
- Adds Zennith creative-pipeline hooks (artifact-bus, ad-id-mint, calibration-gate)
- Re-themes UI for Zennith Studio brand
- Re-skins README, package.json, og-image
- Does not redistribute, does not relicense — Apache-2.0 fully preserved

## Lineage
- 2026-05-03: forked from `nexu-io/open-design@main` by Jenn Woei (jennwoei316)
- Owner: Zennith OS / Gaia-eats
- Hosting: TBD (planned: studio.zennithos.com via Vercel)
