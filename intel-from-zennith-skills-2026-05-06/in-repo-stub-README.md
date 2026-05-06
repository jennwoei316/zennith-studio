# Zennith Studio

> AI-design platform for premium F&B + wellness brands. Powered by [Open Design](https://github.com/nexu-io/open-design) (Apache-2.0).
> **Status: v0.1 SCAFFOLD** — actual fork pending owner approval (F-D1..F-D5 in [ZENNITH-STUDIO-FORK-STRATEGY](../../intel/ZENNITH-STUDIO-FORK-STRATEGY-2026-05-01.md)).

## What's in this directory

This is the SCAFFOLD for the Zennith Studio fork. Actual codebase (apps/, packages/, etc) lives at:
- **Pre-fork:** `~/zennith-skills/intel/clones-2026-05-01-opensesh/open-design/` (gitignored, 864MB clone of upstream)
- **Post-fork:** `github.com/zennith-os/zennith-studio` (NEW — pending org creation)

Files here:
- [`NOTICE.zennith.md`](NOTICE.zennith.md) — Apache-2.0 attribution template (significant changes documented)
- [`SKIN-PLAN.md`](SKIN-PLAN.md) — file-by-file skin pass (3-4h estimated effort)
- [`README.md`](README.md) — this file

## To execute the fork (next session)

1. Owner approves F-D1..F-D5 in [ZENNITH-STUDIO-FORK-STRATEGY](../../intel/ZENNITH-STUDIO-FORK-STRATEGY-2026-05-01.md) §9
2. Create GitHub org (`zennith-os` or chosen name)
3. Run `gh repo fork nexu-io/open-design --org=zennith-os --new-name=zennith-studio`
4. Apply skin per [SKIN-PLAN.md](SKIN-PLAN.md)
5. Smoke-test locally: `pnpm tools-dev start web`
6. Deploy to Vercel: `vercel deploy --prod`

## Lineage

- [intel/ZENNITH-STUDIO-FORK-STRATEGY-2026-05-01.md](../../intel/ZENNITH-STUDIO-FORK-STRATEGY-2026-05-01.md) — full strategy doc
- [intel/ENGINEERING-REVIEW-2026-05-01.md](../../intel/ENGINEERING-REVIEW-2026-05-01.md) — 5-layer review
- [intel/MEGA-MAP-2026-05-01.md](../../intel/MEGA-MAP-2026-05-01.md) §3 R4 — phased plan
