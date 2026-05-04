/**
 * @zennith-studio/overlay/prompts
 *
 * Live mount of the Zennith prompt-bank registry into open-design.
 * Symlinks in this dir:
 *   - ./patterns/        → ~/zennith-skills/skills/prompt-bank/patterns/   (270 .md patterns)
 *   - ./prompt-bank.db   → ~/zennith-skills/skills/prompt-bank/data/prompt-bank.db
 *
 * Source of truth lives at zennith-skills. This module is a typed shim that
 * lets open-design code use the patterns without knowing the file layout.
 */

import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

const PROMPT_BANK_CLI = resolve(
  process.env.HOME!,
  'zennith-skills/skills/prompt-bank/scripts/prompt-bank.sh',
);

/** Pattern bucket — folder names under patterns/ */
export type Bucket =
  | 'templates'
  | 'blocks'
  | 'rules'
  | 'snippets'
  | 'personas'
  | 'frameworks'
  | 'eras'
  | 'autoresearch';

/** Pattern type — matches the SQLite `pattern_type` column */
export type PatternType =
  | 'template'
  | 'block'
  | 'rule'
  | 'snippet'
  | 'persona'
  | 'framework';

export interface PromptQueryArgs {
  useCase?: string;
  tool?: string;
  register?: 'cinematic' | 'ugc' | 'commercial' | 'documentary' | 'tutorial';
  patternType?: PatternType;
  director?: string;
  personaLens?: string;
  bucket?: Bucket;
  top?: number;
}

export interface Pattern {
  id: string;
  name: string;
  body: string;
  bucket: Bucket;
  use_case: string;
  vlm_score_avg?: number;
  use_count?: number;
}

/** Query patterns. Wraps `prompt-bank.sh query` — returns parsed JSON. */
export function query(args: PromptQueryArgs = {}): Pattern[] {
  const argv: string[] = ['query', '--format', 'json'];
  if (args.useCase) argv.push('--use-case', args.useCase);
  if (args.tool) argv.push('--tool', args.tool);
  if (args.register) argv.push('--register', args.register);
  if (args.patternType) argv.push('--pattern-type', args.patternType);
  if (args.director) argv.push('--director', args.director);
  if (args.personaLens) argv.push('--persona-lens', args.personaLens);
  if (args.bucket) argv.push('--bucket', args.bucket);
  if (args.top) argv.push('--top', String(args.top));

  const out = execFileSync('bash', [PROMPT_BANK_CLI, ...argv], {
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
  });
  return JSON.parse(out) as Pattern[];
}

/** Get one pattern by ID. */
export function get(id: string): Pattern | null {
  try {
    const out = execFileSync(
      'bash',
      [PROMPT_BANK_CLI, 'get', id, '--format', 'json'],
      { encoding: 'utf8' },
    );
    return JSON.parse(out) as Pattern;
  } catch {
    return null;
  }
}

/** Apply a persona-lens to a brand for a use-case (composed prompt). */
export function apply(args: {
  lens: string;
  brand: string;
  useCase: string;
}): string {
  return execFileSync(
    'bash',
    [
      PROMPT_BANK_CLI,
      'apply',
      '--lens',
      args.lens,
      '--brand',
      args.brand,
      '--use-case',
      args.useCase,
    ],
    { encoding: 'utf8' },
  );
}

/** Mark a pattern as used (compound feedback). */
export function markUsed(id: string): void {
  execFileSync('bash', [PROMPT_BANK_CLI, 'use', id]);
}

/** Score a pattern (0-10, compound feedback). */
export function score(id: string, vlmScore: number): void {
  execFileSync('bash', [PROMPT_BANK_CLI, 'score', id, String(vlmScore)]);
}

export const PROMPTS_DIR = resolve(__dirname, 'patterns');
export const PROMPT_BANK_DB = resolve(__dirname, 'prompt-bank.db');
