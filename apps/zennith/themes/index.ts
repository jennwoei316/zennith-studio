/**
 * @zennith-studio/overlay/themes
 *
 * Live mount of brand DESIGN.md files as selectable design-systems in open-design.
 * Symlinks in this dir:
 *   - ./<brand>/DESIGN.md            → ~/.openclaw/brands/<brand>/DESIGN.md
 *   - ./<brand>/design-components.md → ~/.openclaw/brands/<brand>/design-components.md (optional)
 *   - ./<brand>/design-guidelines.md → ~/.openclaw/brands/<brand>/design-guidelines.md (optional)
 *
 * Each brand keeps DESIGN.md as the source of truth — this module just types
 * + indexes them for open-design consumption.
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';

export type BrandSlug =
  | 'pinxin-vegan'
  | 'mirra'
  | 'jade-oracle'
  | 'dr-stan'
  | 'rasaya'
  | 'gulatis'
  | 'koru';

export interface BrandTheme {
  slug: BrandSlug;
  designMd: string; // raw markdown of DESIGN.md
  componentsMd?: string;
  guidelinesMd?: string;
  source: {
    designMdPath: string;
    componentsMdPath?: string;
    guidelinesMdPath?: string;
  };
}

const THEMES_ROOT = resolve(__dirname);

const ACTIVE_BRANDS: BrandSlug[] = [
  'pinxin-vegan',
  'mirra',
  'jade-oracle',
  'dr-stan',
  'rasaya',
  'gulatis',
  'koru',
];

/** List all brands with a wired DESIGN.md. */
export function listBrands(): BrandSlug[] {
  return ACTIVE_BRANDS.filter((slug) =>
    existsSync(join(THEMES_ROOT, slug, 'DESIGN.md')),
  );
}

/** Load one brand's full theme (markdown contents). */
export function loadTheme(slug: BrandSlug): BrandTheme | null {
  const dir = join(THEMES_ROOT, slug);
  const designMdPath = join(dir, 'DESIGN.md');
  if (!existsSync(designMdPath)) return null;

  const componentsMdPath = join(dir, 'design-components.md');
  const guidelinesMdPath = join(dir, 'design-guidelines.md');

  return {
    slug,
    designMd: readFileSync(designMdPath, 'utf8'),
    componentsMd: existsSync(componentsMdPath)
      ? readFileSync(componentsMdPath, 'utf8')
      : undefined,
    guidelinesMd: existsSync(guidelinesMdPath)
      ? readFileSync(guidelinesMdPath, 'utf8')
      : undefined,
    source: {
      designMdPath,
      componentsMdPath: existsSync(componentsMdPath)
        ? componentsMdPath
        : undefined,
      guidelinesMdPath: existsSync(guidelinesMdPath)
        ? guidelinesMdPath
        : undefined,
    },
  };
}

/** Get freshness info for a brand theme (when DESIGN.md was last modified). */
export function themeAge(slug: BrandSlug): { ageDays: number; mtime: Date } | null {
  const designMdPath = join(THEMES_ROOT, slug, 'DESIGN.md');
  if (!existsSync(designMdPath)) return null;
  const mtime = statSync(designMdPath).mtime;
  const ageDays = (Date.now() - mtime.getTime()) / (1000 * 60 * 60 * 24);
  return { ageDays, mtime };
}

/** Themes dir on disk — for tools that prefer file paths. */
export const THEMES_DIR = THEMES_ROOT;

export default {
  listBrands,
  loadTheme,
  themeAge,
  THEMES_DIR,
};
