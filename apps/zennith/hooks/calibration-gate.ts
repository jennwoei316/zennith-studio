/**
 * calibration-gate hook — enforces "calibrate before batching" before any
 * branded generation. Stale or missing brand calibration → warn (and return
 * passed:false so the open-design composer can choose to soft-fail).
 *
 * Wraps: ~/.openclaw/skills/artifact-bus/scripts/calibration-gate.sh
 * The bash script is a PreToolUse hook that reads a JSON payload on stdin
 * with shape {tool_input:{command:"creative-gen --brand X"}} and writes its
 * verdict to stderr. We synthesize that payload so we can call the gate
 * directly from open-design's pre-flight.
 *
 *   // import type { Hook, CalibrationCheck } from '@zennith-studio/contracts';
 */
import { spawnSync } from 'node:child_process';
import { homedir } from 'node:os';
import { join } from 'node:path';

const GATE_SH = join(homedir(), '.openclaw/skills/artifact-bus/scripts/calibration-gate.sh');

export interface CalibrationGateResult {
  passed: boolean;
  reason: string;
}

export function calibrationGate(brand: string): CalibrationGateResult {
  const fakePayload = JSON.stringify({
    tool_input: { command: `creative-gen --brand ${brand}` },
  });
  const proc = spawnSync('bash', [GATE_SH], {
    input: fakePayload,
    encoding: 'utf-8',
    timeout: 15_000,
  });
  if (proc.error) {
    return { passed: false, reason: `gate error: ${proc.error.message}` };
  }
  // Gate is non-blocking and prints warnings to stderr; empty stderr = clean.
  const reason = (proc.stderr ?? '').trim();
  if (!reason) return { passed: true, reason: 'fresh' };
  return { passed: false, reason };
}

export default calibrationGate;
