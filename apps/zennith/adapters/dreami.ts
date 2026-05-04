/**
 * Dreami adapter — creative agent (image / video / script).
 * Implements the agent-adapter contract from docs/agent-adapters.md.
 *
 * Dreami routes creative tasks to the right Zennith CLI:
 *   image-gen → ad-composer.sh (NanoBanana / Recraft / Flux)
 *   video-gen → video-gen skill
 *   script    → write-script.sh
 *
 *   // import type { AgentAdapter, AgentRunParams, AgentEvent } from '@zennith-studio/contracts';
 */
import { spawnSync } from 'node:child_process';
import { homedir } from 'node:os';
import { join } from 'node:path';

export type DreamiTask = 'image-gen' | 'video-gen' | 'script';

export interface DreamiRunInput {
  task: DreamiTask;
  brief: string;
  brand: string;
  cwd?: string;
}

export interface DreamiResult {
  ok: boolean;
  output: string;
  scriptPath: string;
}

const HOME = homedir();
const SCRIPTS: Record<DreamiTask, string> = {
  'image-gen': join(HOME, '.openclaw/skills/ad-composer/scripts/ad-compose.sh'),
  'video-gen': join(HOME, '.openclaw/skills/video-gen/scripts/video-gen.sh'),
  script: join(HOME, '.openclaw/skills/write-script/scripts/write-script.sh'),
};

export const dreami = {
  id: 'dreami',
  displayName: 'Dreami (Creative)',
  capabilities: () => ({
    surgicalEdit: false,
    nativeSkillLoading: true,
    streaming: false,
    resume: false,
    permissionMode: 'permissive' as const,
  }),
  run(input: DreamiRunInput): DreamiResult {
    const script = SCRIPTS[input.task];
    // TODO: real bash scripts may differ — leaving fall-through for now.
    const proc = spawnSync(
      'bash',
      [script, '--brand', input.brand, '--brief', input.brief],
      { cwd: input.cwd ?? process.cwd(), encoding: 'utf-8', timeout: 600_000 },
    );
    return {
      ok: proc.status === 0,
      output: (proc.stdout ?? '').trim(),
      scriptPath: script,
    };
  },
};

export default dreami;
