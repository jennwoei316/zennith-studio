# Zennith Merge Protocol — open-design upstream tracking

> Created 2026-05-06 per `intel/PHASE-D-AUDIT-A-stack-overlap-2026-05-06.md` §6 step 5.
> Decision: upstream-track via overlay (not divergent fork).

## Remotes

```
origin    https://github.com/jennwoei316/zennith-studio.git    (Zennith fork)
upstream  https://github.com/nexu-io/open-design.git          (TÂCHES upstream)
```

## What lives where

| Path | Owner | Source of truth |
|---|---|---|
| `apps/`, `packages/`, `tools/`, root configs | upstream | `nexu-io/open-design` — DON'T edit, will rebase nightly |
| `apps/zennith/` (workspace overlay) | Zennith | All Zennith-specific code: artifact-bus hook, calibration-gate, Hermes profiles, Klaviyo/Shopify adapters |
| `apps/zennith/hooks/` | Zennith | PreToolUse / PostToolUse / `cmd_generate` shadow hooks |
| `apps/zennith/exports/` | Zennith | brand-DESIGN.md mount points + asset export adapters |
| `apps/zennith/prompts/` | Zennith | brand-aware prompt overrides for open-design's slash commands |
| `intel-from-zennith-skills-2026-05-06/` | Zennith | Migration docs (SKIN-PLAN, NOTICE) preserved during retirement of `projects/zennith-studio/` |
| `ZENNITH-MERGE-PROTOCOL.md` (this file) | Zennith | Merge cadence + conflict-resolution playbook |

**Hard rule**: nothing Zennith-specific lives outside `apps/zennith/`. If a fix needs to touch upstream code, send it as a PR to `nexu-io/open-design` — don't carry the patch locally.

## Merge cadence

Monthly on the 1st. Process:

```bash
cd ~/zennith-studio
git fetch upstream
git checkout main
git merge upstream/main --no-ff -m "merge upstream/main 2026-MM-DD"

# Conflict resolution rule:
#   - apps/zennith/* conflict → keep ours (our overlay wins)
#   - everything else → keep theirs (upstream wins)
# Conflicts inside apps/zennith/* are bugs in our hook layout — fix and merge.
git diff --name-only --diff-filter=U | while read f; do
  case "$f" in
    apps/zennith/*) git checkout --ours "$f"  ;;
    *)              git checkout --theirs "$f" ;;
  esac
  git add "$f"
done

# Smoke test — daemon starts cleanly?
pnpm install
pnpm tools-dev start web --daemon-port 7457 --web-port 5175 &
sleep 3
curl -fsS http://127.0.0.1:7457/api/health | grep '"ok":true' || echo "❌ daemon broken post-merge"
pnpm tools-dev stop

# Ship merge commit
git commit --no-edit
git push origin main
```

If the smoke test fails: revert the merge, file an upstream issue, and stay on the previous month's pin until the upstream regression is fixed.

## Cost discipline

This protocol replaces a divergent fork (40-90h/year of manual rebasing per `intel/FORK-UPDATE-STRATEGY-2026-05-01.md`). Expected cost: ≤2h/month for the merge + smoke + push.

## Audit trail

- 2026-05-06 audit verdict: `intel/PHASE-D-AUDIT-A-stack-overlap-2026-05-06.md` §2 (fork-vs-track decision) + §6 step 5 (this protocol)
- Upstream README: https://github.com/nexu-io/open-design
