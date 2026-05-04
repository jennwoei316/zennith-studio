/**
 * Meta export — push a generated ad creative to Meta as a draft ad,
 * tagged with the minted ad_id (so the chain UTM→Shopify→CAPI lights up).
 *
 * Wraps: ~/zennith-skills/skills/meta-system/scripts/meta-system.sh
 * Pre-flight: caller MUST have minted an ad_id via hooks/ad-id-mint.ts —
 * the ad_id becomes ad_name in the Meta upload and utm_content in the URL.
 *
 *   // import type { Exporter, MetaUploadTarget } from '@zennith-studio/contracts';
 */
import { spawnSync } from 'node:child_process';
import { homedir } from 'node:os';
import { join } from 'node:path';

const META_SH = join(homedir(), 'zennith-skills/skills/meta-system/scripts/meta-system.sh');

export type MetaKind = 'image' | 'video' | 'carousel';

export interface MetaExportInput {
  artifactPath: string;
  kind: MetaKind;
  brand: string;
  adId: string;
  trackedUrl: string;
  copy?: string;
  adAccount?: string;
}

export interface MetaExportResult {
  ok: boolean;
  metaCreativeId?: string;
  metaAdId?: string;
  message: string;
}

export function exportToMeta(input: MetaExportInput): MetaExportResult {
  const args = [
    META_SH,
    'upload-ad',
    '--brand', input.brand,
    '--kind', input.kind,
    '--file', input.artifactPath,
    '--ad-id', input.adId,
    '--ad-name', input.adId,
    '--destination-url', input.trackedUrl,
  ];
  if (input.copy) args.push('--copy', input.copy);
  if (input.adAccount) args.push('--account', input.adAccount);

  const proc = spawnSync('bash', args, { encoding: 'utf-8', timeout: 180_000 });
  const stdout = (proc.stdout ?? '').trim();
  let creativeId: string | undefined;
  let metaAdId: string | undefined;
  try {
    const parsed = JSON.parse(stdout);
    if (parsed.creative_id) creativeId = String(parsed.creative_id);
    if (parsed.ad_id) metaAdId = String(parsed.ad_id);
  } catch { /* permit non-JSON for v0.1 */ }
  return {
    ok: proc.status === 0,
    metaCreativeId: creativeId,
    metaAdId,
    message: ((proc.stderr ?? '') + stdout).trim().slice(0, 600),
  };
}

export default exportToMeta;
