# NOTICE.zennith — Apache-2.0 Attribution

**Zennith Studio** is a fork of [`nexu-io/open-design`](https://github.com/nexu-io/open-design), licensed under Apache License 2.0.

## Significant changes from upstream

This fork modifies the original `nexu-io/open-design` to:

1. **Brand identity** — replaced "Open Design" branding (logo, name, color palette, fonts, OG image, favicon) with Zennith OS identity. See `SKIN-PLAN.md` for file-by-file changes.
2. **Brand systems** — mounted 7 GAIA brand `DESIGN.md` files into `design-systems/` via symlinks (Pinxin Vegan, Mirra, Jade Oracle, Dr Stan, Wholey Wonder, Rasaya, Kyochon).
3. **Daemon hooks** — added `on-artifact-save` (artifact-bus emit), `on-generation-start` (calibration-gate + ad_id-draft mint), and `on-publish` (ad-id-mint finalize) hooks in `apps/daemon/src/`.
4. **Direction picker** — added "Zennith Editorial" + "GAIA Lifestyle" as 6th + 7th visual directions in `apps/web/src/prompts/directions.ts`.
5. **Device frames** — added Apple Watch + Vision Pro + Foldable Android frames in `assets/frames/`.
6. **Hermes integration** — added Zennith Hermes profiles (zenni / taoz / dreami / scout) to the agent picker (NOTE: distinct from Nous Research's `hermes-agent` per `reference_hermes_naming_collision.md`).
7. **Klaviyo + Shopify export adapters** — new artifact-export targets in `apps/daemon/src/exports/`.
8. **brand-prompt-library** — bundled as `scenario: marketing → skill: prompt-library` deck mode.

Changes are tracked per file in `SKIN-PLAN.md` + commit history.

## Original work credits

Open Design © 2026 nexu-io and contributors. Apache-2.0.

The following bundled OSS components are preserved verbatim with their original licenses:
- `skills/guizang-ppt/` — © op7418 (alchaincyf/huashu-design philosophy)
- inspired patterns from `OpenCoworkAI/open-codesign` (vendored React 18 + Babel preview pattern)
- inspired patterns from `multica-ai/multica` (PATH-scan agent detection)
- 70 product design systems from [`VoltAgent/awesome-design-md`](https://github.com/VoltAgent/awesome-design-md)
- 57 design skills from [`bergside/awesome-design-skills`](https://github.com/bergside/awesome-design-skills)

All upstream LICENSE files preserved unchanged.

## How to track upstream changes

This fork uses **soft-fork** strategy:
```bash
git remote add upstream https://github.com/nexu-io/open-design.git
git fetch upstream
git log HEAD..upstream/main --oneline    # see what's new
git merge upstream/main                  # bring changes in (selectively)
```

Cadence: monthly upstream review. See `intel/ZENNITH-STUDIO-FORK-STRATEGY-2026-05-01.md` §F6.

## License

This fork remains under Apache License 2.0. Full text in `LICENSE` (preserved from upstream).
