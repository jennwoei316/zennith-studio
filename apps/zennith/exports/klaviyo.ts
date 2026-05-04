/**
 * Klaviyo export — push an email artifact (HTML template / flow message)
 * into the configured Klaviyo account.
 *
 * Wraps: ~/zennith-skills/skills/klaviyo-engine/scripts/klaviyo.sh
 * Brand → Klaviyo account map: see CLAUDE.md "Brand-Specific Config"
 * (Pinxin → U5NkYa is the only one wired in v0.1).
 *
 *   // import type { Exporter, KlaviyoTarget } from '@zennith-studio/contracts';
 */
import { spawnSync } from 'node:child_process';
import { homedir } from 'node:os';
import { join } from 'node:path';

const KLAVIYO_SH = join(homedir(), 'zennith-skills/skills/klaviyo-engine/scripts/klaviyo.sh');

export type KlaviyoKind = 'template' | 'flow-message' | 'campaign-html';

export interface KlaviyoExportInput {
  htmlPath: string;
  kind: KlaviyoKind;
  brand: string;
  templateName?: string;
  flowId?: string;
}

export interface KlaviyoExportResult {
  ok: boolean;
  templateId?: string;
  message: string;
}

export function exportToKlaviyo(input: KlaviyoExportInput): KlaviyoExportResult {
  const args = [
    KLAVIYO_SH,
    'upload',
    '--kind', input.kind,
    '--file', input.htmlPath,
    '--brand', input.brand,
  ];
  if (input.templateName) args.push('--name', input.templateName);
  if (input.flowId) args.push('--flow-id', input.flowId);

  const proc = spawnSync('bash', args, { encoding: 'utf-8', timeout: 90_000 });
  const stdout = (proc.stdout ?? '').trim();
  let templateId: string | undefined;
  try {
    const parsed = JSON.parse(stdout);
    if (parsed.template_id) templateId = String(parsed.template_id);
  } catch { /* non-JSON output is fine for v0.1 */ }
  return {
    ok: proc.status === 0,
    templateId,
    message: ((proc.stderr ?? '') + stdout).trim().slice(0, 600),
  };
}

export default exportToKlaviyo;
