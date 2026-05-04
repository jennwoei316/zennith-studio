/**
 * Zenni adapter — orchestrator. Routes any incoming task via classify.sh
 * to the right downstream agent (Dreami / Scout / Taoz) or skill.
 *
 * Wraps: ~/.openclaw/skills/orchestrate-v2/scripts/classify.sh
 *
 *   // import type { AgentAdapter, AgentRunParams, AgentEvent } from '@zennith-studio/contracts';
 */
import { spawnSync } from 'node:child_process';
import { homedir } from 'node:os';
import { join } from 'node:path';

const CLASSIFY_SH = join(homedir(), '.openclaw/skills/orchestrate-v2/scripts/classify.sh');

export interface ZenniRouteInput {
  task: string;
  brand?: string;
  context?: string;
}

export interface ZenniRouteResult {
  agent: 'dreami' | 'scout' | 'taoz' | 'zenni';
  skill?: string;
  reasoning: string;
  raw: string;
}

export const zenni = {
  id: 'zenni',
  displayName: 'Zenni (Orchestrator)',
  capabilities: () => ({
    surgicalEdit: false,
    nativeSkillLoading: true,
    streaming: false,
    resume: false,
    permissionMode: 'permissive' as const,
  }),
  classify(input: ZenniRouteInput): ZenniRouteResult {
    const args = [CLASSIFY_SH, '--task', input.task];
    if (input.brand) args.push('--brand', input.brand);
    if (input.context) args.push('--context', input.context);

    const proc = spawnSync('bash', args, { encoding: 'utf-8', timeout: 60_000 });
    const raw = (proc.stdout ?? '').trim();
    let agent: ZenniRouteResult['agent'] = 'zenni';
    let skill: string | undefined;
    let reasoning = raw;
    try {
      const parsed = JSON.parse(raw);
      if (parsed.agent) agent = parsed.agent;
      if (parsed.skill) skill = parsed.skill;
      if (parsed.reasoning) reasoning = parsed.reasoning;
    } catch {
      // classify.sh may print plain-text routing — fall through with raw.
    }
    return { agent, skill, reasoning, raw };
  },
};

export default zenni;
