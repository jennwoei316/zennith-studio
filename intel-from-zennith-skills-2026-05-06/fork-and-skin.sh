#!/usr/bin/env bash
# fork-and-skin.sh — one-shot Zennith Studio fork + skin operation (F1)
# Per: ../SKIN-PLAN.md + ../../../intel/ZENNITH-STUDIO-FORK-STRATEGY-2026-05-01.md
# Status: v0.1 (2026-05-02)
# Owner-gated: requires github.com/zennith-os org to exist OR --org override
#
# Usage:
#   bash fork-and-skin.sh [--org OWNER] [--name REPO_NAME] [--dry-run]
#
# Steps fired in order:
#   1. Verify org exists (or fail with helpful message)
#   2. Fork upstream → org/zennith-studio
#   3. Clone fork to ~/zennith-studio (or current dir if symlinked)
#   4. Establish overlay architecture (Step 0 from SKIN-PLAN)
#   5. Apply skin (Step 2 from SKIN-PLAN: package.json, layout.tsx, README, NOTICE)
#   6. Smoke install
#   7. Print next steps for vercel deploy
set -euo pipefail

ORG="zennith-os"
NAME="zennith-studio"
DRY_RUN=0
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=1 ;;
    --org=*)   ORG="${arg#--org=}" ;;
    --name=*)  NAME="${arg#--name=}" ;;
    -*)        echo "Unknown flag: $arg" >&2; exit 2 ;;
  esac
done

UPSTREAM="nexu-io/open-design"
TARGET_DIR="$HOME/$NAME"

echo "=== Zennith Studio fork-and-skin v0.1 ==="
echo "Org:      $ORG"
echo "Name:     $NAME"
echo "Upstream: $UPSTREAM"
echo "Target:   $TARGET_DIR"
echo "Dry run:  $DRY_RUN"
echo ""

run() {
  if [ "$DRY_RUN" = "1" ]; then
    echo "[DRY] $*"
  else
    echo "[FIRE] $*"
    eval "$@"
  fi
}

# === Step 1: verify org ===
echo "--- Step 1: verify github.com/$ORG exists ---"
if ! gh api "orgs/$ORG" --jq .login >/dev/null 2>&1; then
  if ! gh api "users/$ORG" --jq .login >/dev/null 2>&1; then
    cat >&2 <<EOF
ERROR: github.com/$ORG does not exist (neither as org nor user).

Owner action required:
  1. Visit https://github.com/organizations/new
  2. Create '$ORG' (free tier OK)
  3. Re-run this script

Alternative: pass --org with an existing owner you have admin on:
  bash fork-and-skin.sh --org=Gaia-eats
  bash fork-and-skin.sh --org=jennwoei316
EOF
    exit 2
  fi
  echo "  ! '$ORG' is a USER account (not org). Continuing under user namespace."
fi
echo "  ✓ $ORG resolves"

# === Step 2: fork ===
echo "--- Step 2: fork $UPSTREAM → $ORG/$NAME ---"
if gh repo view "$ORG/$NAME" >/dev/null 2>&1; then
  echo "  ! $ORG/$NAME already exists; skipping fork"
else
  run "gh repo fork '$UPSTREAM' --org='$ORG' --fork-name='$NAME' --clone=false"
fi

# === Step 3: clone to target ===
echo "--- Step 3: clone to $TARGET_DIR ---"
if [ -d "$TARGET_DIR/.git" ]; then
  echo "  ! $TARGET_DIR already exists with .git; skipping clone"
else
  run "git clone 'https://github.com/$ORG/$NAME.git' '$TARGET_DIR'"
fi

# === Step 4: overlay architecture (Step 0 in SKIN-PLAN) ===
echo "--- Step 4: establish overlay architecture ---"
if [ "$DRY_RUN" = "0" ]; then
  cd "$TARGET_DIR" || exit 1
fi
run "mkdir -p apps/zennith/{hooks,exports,adapters,prompts,themes}"
run "[ -f pnpm-workspace.yaml ] && grep -q \"apps/zennith\" pnpm-workspace.yaml || echo \"  - 'apps/zennith'\" >> pnpm-workspace.yaml"

if [ "$DRY_RUN" = "0" ]; then
  cat > apps/zennith/package.json <<'JSON'
{
  "name": "@zennith-studio/overlay",
  "version": "0.1.0",
  "private": true,
  "main": "./hooks/index.ts",
  "description": "Zennith-specific hooks, exports, adapters, prompts, and themes layered onto open-design."
}
JSON
  echo "  ✓ apps/zennith/package.json written"
fi

# === Step 5: skin (Step 2 from SKIN-PLAN) ===
echo "--- Step 5: apply skin ---"
if [ "$DRY_RUN" = "0" ]; then
  # 5a. README replace
  cat > README.md <<'MD'
# Zennith Studio

> Brand-aligned design generation for the Zennith OS — forked from [nexu-io/open-design](https://github.com/nexu-io/open-design).

Visual layer for Zennith brands: live AI-generated artifacts (HTML, decks, landing pages, dashboards)
from natural-language briefs, scoped to your brand DNA + design systems.

## Quick start
```bash
pnpm install
pnpm tools-dev start web
open http://localhost:5175
```

## Architecture
Pattern 3 (soft-fork + isolated overlay) per
[FORK-UPDATE-STRATEGY](https://github.com/jennwoei316/zennith-skills/blob/main/intel/FORK-UPDATE-STRATEGY-2026-05-01.md):
all Zennith additions live in `apps/zennith/` so upstream merges stay clean.

## Upstream sync
Monthly `git fetch upstream && git merge upstream/main` per [ZENNITH-MERGE-PROTOCOL.md](ZENNITH-MERGE-PROTOCOL.md).

## License
Apache-2.0 (preserved from upstream). See NOTICE.zennith.md for attribution.
MD
  echo "  ✓ README.md written"

  # 5b. Update package.json name + description (sed in place)
  if [ -f package.json ]; then
    python3 - <<PYEOF
import json, sys
with open('package.json') as f: d = json.load(f)
d['name'] = 'zennith-studio'
d['description'] = 'Zennith Studio — brand-aligned design generation, fork of open-design.'
d['repository'] = {'type': 'git', 'url': 'git+https://github.com/$ORG/$NAME.git'}
with open('package.json', 'w') as f: json.dump(d, f, indent=2)
PYEOF
    echo "  ✓ package.json patched"
  fi

  # 5c. Layout title (best-effort, file may not exist exactly here)
  LAYOUT="apps/web/src/app/layout.tsx"
  if [ -f "$LAYOUT" ]; then
    python3 - <<PYEOF
import re
with open('$LAYOUT') as f: src = f.read()
src = re.sub(r"title:\s*['\"][^'\"]*['\"]", "title: 'Zennith Studio'", src)
src = re.sub(r"description:\s*['\"][^'\"]*['\"]", "description: 'Brand-aligned design generation for Zennith OS.'", src, count=1)
with open('$LAYOUT', 'w') as f: f.write(src)
PYEOF
    echo "  ✓ $LAYOUT title patched"
  else
    echo "  ! $LAYOUT not found; skip"
  fi
fi

# === Step 6: smoke install ===
echo "--- Step 6: smoke install ---"
run "pnpm install --frozen-lockfile=false"

# === Step 7: next steps ===
echo ""
echo "=== F1 v0.1 complete ==="
echo "Next:"
echo "  cd $TARGET_DIR"
echo "  pnpm tools-dev start web"
echo "  open http://localhost:5175"
echo ""
echo "Then vercel deploy (owner action):"
echo "  vercel link"
echo "  vercel --prod"
echo ""
echo "Then DNS for studio.zennithos.com (owner action; Cloudflare or Vercel domains)."

exit 0
