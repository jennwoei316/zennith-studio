/**
 * ad-id-mint hook — mints a unique ad_id for any creative that becomes an ad.
 *
 * Wraps: ~/.openclaw/skills/unified-intel/scripts/ad-id-mint.sh
 * Returns: { ad_id, tracked_url, ledger_entry_path }
 *
 * The chain creative→audit→Meta→UTM→Shopify→CAPI→ROAS depends on this id
 * being minted BEFORE generation. See CLAUDE.md "AD ID CHAIN" rule.
 *
 *   // import type { Hook, AdIdMintRequest } from '@zennith-studio/contracts';
 */
import { execFileSync } from 'node:child_process';
import { homedir } from 'node:os';
import { join } from 'node:path';

const MINT_SH = join(homedir(), '.openclaw/skills/unified-intel/scripts/ad-id-mint.sh');

export type Channel = 'meta' | 'google' | 'tiktok' | 'whatsapp' | 'klaviyo' | 'shopify' | 'web';

export interface AdIdMintInput {
  brand: string;
  type: 'ad' | 'asset' | 'post';
  channel: Channel;
  title: string;
  destination?: string;
  parentAsset?: string;
}

export interface AdIdMintResult {
  ad_id: string;
  tracked_url: string;
  ledger_entry_path: string;
}

export function mintAdId(input: AdIdMintInput): AdIdMintResult {
  const args = [
    MINT_SH,
    '--brand', input.brand,
    '--type', input.type,
    '--channel', input.channel,
    '--title', input.title,
  ];
  if (input.destination) args.push('--destination', input.destination);
  if (input.parentAsset) args.push('--parent-asset', input.parentAsset);

  const stdout = execFileSync('bash', args, { encoding: 'utf-8', timeout: 30_000 });
  const parsed = JSON.parse(stdout);
  return {
    ad_id: String(parsed.ad_id),
    tracked_url: String(parsed.tracked_url ?? ''),
    ledger_entry_path: String(parsed.ledger_entry_path ?? parsed.ledger_path ?? ''),
  };
}

export default mintAdId;
