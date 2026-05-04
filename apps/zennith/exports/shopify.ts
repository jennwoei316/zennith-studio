/**
 * Shopify export — push a generated artifact (theme / landing / banner)
 * to the configured Shopify store.
 *
 * Wraps: ~/zennith-skills/skills/shopify-engine/scripts/shopify.sh
 * Brand config drives the SHOPIFY_CONFIG env var (see CLAUDE.md
 * "Brand-Specific Config" table).
 *
 *   // import type { Exporter, ShopifyTarget } from '@zennith-studio/contracts';
 */
import { spawnSync } from 'node:child_process';
import { homedir } from 'node:os';
import { join } from 'node:path';

const SHOPIFY_SH = join(homedir(), 'zennith-skills/skills/shopify-engine/scripts/shopify.sh');

export type ShopifyKind = 'theme' | 'landing' | 'banner' | 'product-image';

export interface ShopifyExportInput {
  artifactPath: string;
  kind: ShopifyKind;
  brand: string;
  configPath?: string;
}

export interface ShopifyExportResult {
  ok: boolean;
  storeUrl?: string;
  message: string;
}

export function exportToShopify(input: ShopifyExportInput): ShopifyExportResult {
  const env: NodeJS.ProcessEnv = { ...process.env };
  if (input.configPath) env.SHOPIFY_CONFIG = input.configPath;

  const proc = spawnSync(
    'bash',
    [SHOPIFY_SH, 'push', '--kind', input.kind, '--file', input.artifactPath, '--brand', input.brand],
    { env, encoding: 'utf-8', timeout: 120_000 },
  );
  return {
    ok: proc.status === 0,
    storeUrl: parseStoreUrl(proc.stdout ?? ''),
    message: ((proc.stderr ?? '') + (proc.stdout ?? '')).trim().slice(0, 600),
  };
}

function parseStoreUrl(out: string): string | undefined {
  const m = out.match(/https?:\/\/[\w.-]+\.myshopify\.com[^\s"']*/);
  return m ? m[0] : undefined;
}

export default exportToShopify;
