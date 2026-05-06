# Zennith Studio — Skin Plan (file-by-file)

> File-level changes to apply during F1 phase to rebrand `nexu-io/open-design` as "Zennith Studio".
> Total estimated effort: **3-4 hours** for a polished skin pass.
> Per [intel/ZENNITH-STUDIO-FORK-STRATEGY-2026-05-01.md](../../intel/ZENNITH-STUDIO-FORK-STRATEGY-2026-05-01.md) §2 Layer B.

## Status (2026-05-02)

**🔴 BLOCKED on owner action: GitHub org `zennith-os` does not exist.**

`gh api orgs/zennith-os` returns 404 (verified 2026-05-02). My GitHub session
(`jennwoei316`) does not have `admin:org` scope; even with that scope, creating
an org via API requires Enterprise admin and is gated through the GitHub web UI
for personal accounts. Owner must:

1. Visit https://github.com/organizations/new and create `zennith-os` (free tier OK; ~5 min)
2. Once created, run: `gh repo fork nexu-io/open-design --org=zennith-os --new-name=zennith-studio --clone`

Alternative if owner doesn't want a new org: use `--org=Gaia-eats` (existing) or
`--fork-name` under personal account `jennwoei316`. SKIN-PLAN below works either way.

A one-shot script lives at [`scripts/fork-and-skin.sh`](scripts/fork-and-skin.sh) — runs Step 1 → Step 5 in
sequence once the org exists. Smoke-tested in dry-run mode.

## Pre-fork checklist (owner-gated)

- [ ] **F-D1:** Approve fork in principle (recommend YES)
- [ ] **F-D2:** Confirm name = "Zennith Studio"
- [ ] **F-D3:** Confirm domain = `studio.zennithos.com` (or alternative)
- [ ] **F-D4:** Confirm GitHub org = new `zennith-os` (or existing)
- [ ] **F-D5:** Confirm public OSS launch (recommend YES)
- [ ] **F-D11:** Adopt Pattern 3 (overlay) instead of naive fork — see [intel/FORK-UPDATE-STRATEGY-2026-05-01.md](../../intel/FORK-UPDATE-STRATEGY-2026-05-01.md) §3 (recommend YES — saves 40-90h/yr)
- [ ] **F-D12:** Sponsor nexu-io @ $50/mo via GitHub Sponsors after F1 ships (recommend YES)
- [ ] **F-D13:** Commit to monthly upstream-merge cadence (30min-1h/mo) (recommend YES, non-negotiable for public)

## Step 0 — Establish overlay architecture (1h, MANDATORY before Step 1)

Per [intel/FORK-UPDATE-STRATEGY-2026-05-01.md](../../intel/FORK-UPDATE-STRATEGY-2026-05-01.md) §3:

```bash
# 1. Create overlay workspace package
mkdir -p apps/zennith/{hooks,exports,adapters,prompts,themes}

# 2. Add to root pnpm-workspace.yaml
echo "  - 'apps/zennith'" >> pnpm-workspace.yaml

# 3. Create overlay package.json
cat > apps/zennith/package.json <<JSON
{
  "name": "@zennith-studio/overlay",
  "version": "0.1.0",
  "private": true,
  "main": "./hooks/index.ts"
}
JSON

# 4. Document in ZENNITH-MERGE-PROTOCOL.md (template in fork-update-strategy doc §4)
```

**Architectural rule (write into CLAUDE.md):** NEVER edit `apps/daemon/src/server.ts` or `apps/web/src/prompts/directions.ts` directly. Always register via `apps/zennith/hooks/index.ts` or `apps/zennith/prompts/zennith-directions.ts`. The 5 files in [FORK-UPDATE-STRATEGY §3](../../intel/FORK-UPDATE-STRATEGY-2026-05-01.md) are the ONLY upstream files we touch.

## Step 1 — Repo setup (15min, gated on F-D4)

```bash
# Create org on GitHub (web UI, owner action)
# Then:
gh repo fork nexu-io/open-design --org=zennith-os --new-name=zennith-studio --clone

# Or if already cloned locally:
cd ~/zennith-skills/intel/clones-2026-05-01-opensesh/open-design
git remote rename origin upstream
git remote add origin git@github.com:zennith-os/zennith-studio.git
git push -u origin main
```

## Step 2 — Brand identity files (3-4h)

| File | Change | Time |
|---|---|---|
| `package.json` `name` | `"open-design"` → `"zennith-studio"` | 1min |
| `package.json` `description` | replace with Zennith Studio tagline | 2min |
| `package.json` `homepage` | → `https://studio.zennithos.com` | 1min |
| `package.json` `repository` | → `git@github.com:zennith-os/zennith-studio.git` | 1min |
| `apps/web/src/app/layout.tsx` | `<title>Open Design</title>` → `<title>Zennith Studio</title>`; meta description | 5min |
| `apps/web/public/favicon.ico` | Replace with Zennith favicon (need brand asset from Tricia) | 5min |
| `apps/web/public/og-image.png` | Generate Zennith Studio OG (1200x630) — use Zennith Studio itself once skinned | 30min |
| `apps/web/src/styles/theme.css` | Tailwind theme override → Zennith brand palette | 1h |
| `apps/web/tailwind.config.ts` | Color tokens → Zennith primary/accent | 30min |
| `apps/web/src/components/Header.tsx` (or wherever logo lives) | Swap logo SVG component | 15min |
| `apps/web/src/components/Footer.tsx` | "Powered by Zennith OS" + attribution to Open Design | 10min |
| `apps/web/src/app/page.tsx` (welcome dialog) | Tagline, hero copy, CTA | 30min |
| `apps/web/src/prompts/directions.ts` | Add 6th "Zennith Editorial" + 7th "GAIA Lifestyle" | 30min |
| `README.md` (root) | Replace with Zennith Studio README + Open Design attribution | 30min |
| `LICENSE` | KEEP UNCHANGED (Apache-2.0 preserved) | 0 |
| `NOTICE.zennith.md` | THIS FILE — written. Add `NOTICE` (upstream) preserved alongside | done |
| `.github/workflows/*` | Update org references in CI configs | 15min |

## Step 3 — Add Zennith differentiators (Layer C, ~1 week post-skin)

Per [ZENNITH-STUDIO-FORK-STRATEGY](../../intel/ZENNITH-STUDIO-FORK-STRATEGY-2026-05-01.md) §2 Layer C:

| Feature | Effort | File(s) |
|---|---|---|
| artifact-bus emit hook | 4h | `apps/daemon/src/server.ts` + `apps/daemon/src/hooks/on-artifact-save.ts` |
| calibration-gate hook | 4h | `apps/daemon/src/hooks/on-generation-start.ts` |
| ad-id-mint button + finalize endpoint | 6h | `apps/web/src/components/MintButton.tsx` + `apps/daemon/src/routes/finalize.ts` |
| Hermes profiles in agent picker | 1d | `apps/daemon/src/agents.ts` (add zenni/taoz/dreami/scout adapters) |
| Klaviyo + Shopify export | 2d | `apps/daemon/src/exports/{klaviyo,shopify}.ts` |
| brand-prompt-library deck mode | 1d | `skills/zennith-prompt-library/SKILL.md` (new) |
| Zennith Vault Universe view (3D Three.js cosmos) | 3d | `apps/web/src/app/vault/page.tsx` (new route) |

## Step 4 — Verify + Deploy (~2h)

```bash
# Local smoke
pnpm install
pnpm tools-dev start web
open http://localhost:5175    # verify Zennith branding visible

# Vercel deploy
vercel link
vercel deploy --prod
# → studio.zennithos.com (after DNS configured)
```

## Step 5 — Public launch announcement

Per [ZENNITH-STUDIO-FORK-STRATEGY](../../intel/ZENNITH-STUDIO-FORK-STRATEGY-2026-05-01.md) §5 Phase F3:

- [ ] HN launch post ("Show HN: Zennith Studio")
- [ ] IG carousel + Reels (use Zennith Studio itself to generate them — meta proof)
- [ ] X thread
- [ ] Product Hunt
- [ ] Doc site at `docs.zennithos.com/studio`

## Status

**v0.1 SCAFFOLD** — 2026-05-01. NOTICE template + this skin plan ready. Awaiting Jenn F-D1..F-D5 to begin actual fork operation.

## Lineage

- Spec: [ZENNITH-STUDIO-FORK-STRATEGY-2026-05-01.md](../../intel/ZENNITH-STUDIO-FORK-STRATEGY-2026-05-01.md)
- Engineering review: [ENGINEERING-REVIEW-2026-05-01.md](../../intel/ENGINEERING-REVIEW-2026-05-01.md)
- Source: `nexu-io/open-design` Apache-2.0 fork
