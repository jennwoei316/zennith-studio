/**
 * artifact-bus hook — emits to the canonical Zennith artifact graph on save.
 *
 * Wraps: ~/.openclaw/skills/artifact-bus/scripts/emit.sh
 * Mode: artifact registration (--path / --type / --brand)
 * Returns the registered artifact_id (event_id) string.
 *
 * See packages/contracts for upstream open-design hook types (TODO: import once
 * a Hook<T> contract exists in zennith-studio):
 *   // import type { Hook, ArtifactSaveEvent } from '@zennith-studio/contracts';
 */
import { execFileSync } from 'node:child_process';
import { homedir } from 'node:os';
import { join } from 'node:path';

const EMIT_SH = join(homedir(), '.openclaw/skills/artifact-bus/scripts/emit.sh');

export type ArtifactType = 'image' | 'video' | 'prompt' | 'copy' | 'audio' | 'doc';

export interface ArtifactBusInput {
  artifactPath: string;
  brand: string;
  type: ArtifactType;
  campaign?: string;
  promptJson?: string;
  vlmScore?: number;
}

export function emitArtifact(input: ArtifactBusInput): string {
  const args: string[] = [
    EMIT_SH,
    '--path', input.artifactPath,
    '--type', input.type,
    '--brand', input.brand,
  ];
  if (input.campaign) args.push('--campaign', input.campaign);
  if (input.promptJson) args.push('--prompt-json', input.promptJson);
  if (typeof input.vlmScore === 'number') args.push('--vlm-score', String(input.vlmScore));

  const stdout = execFileSync('bash', args, { encoding: 'utf-8', timeout: 30_000 });
  // emit.sh prints JSON {artifact_id, ...}
  try {
    const parsed = JSON.parse(stdout);
    if (typeof parsed.artifact_id !== 'string') {
      throw new Error('emit.sh response missing artifact_id');
    }
    return parsed.artifact_id;
  } catch (err) {
    throw new Error(`artifact-bus emit failed to parse: ${(err as Error).message} :: ${stdout}`);
  }
}

export default emitArtifact;
