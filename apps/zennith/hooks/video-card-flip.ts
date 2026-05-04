/**
 * video-card-flip hook — VLM-detects card-flip animations (Tricia's hard-no)
 * in AI-generated video. HARD REJECT when detected.
 *
 * Wraps: ~/.openclaw/skills/video-card-flip-detector/scripts/detect.sh
 * The bash script samples 3 frames (10/50/90%), asks Qwen via vlm-see.sh,
 * exits 1 when ≥threshold frames match. Cost ≈$0.0001/video.
 *
 *   // import type { Hook, VideoCheck } from '@zennith-studio/contracts';
 */
import { spawnSync } from 'node:child_process';
import { homedir } from 'node:os';
import { join } from 'node:path';

const DETECT_SH = join(
  homedir(),
  '.openclaw/skills/video-card-flip-detector/scripts/detect.sh',
);

export interface VideoCardFlipInput {
  videoPath: string;
  adId?: string;
  threshold?: number;
}

export interface VideoCardFlipResult {
  flip_detected: boolean;
  frames_analyzed: number;
  reason: string;
}

export function detectCardFlip(input: VideoCardFlipInput): VideoCardFlipResult {
  const args = [DETECT_SH, '--video', input.videoPath];
  if (input.adId) args.push('--ad-id', input.adId);
  if (typeof input.threshold === 'number') args.push('--threshold', String(input.threshold));

  const proc = spawnSync('bash', args, { encoding: 'utf-8', timeout: 90_000 });
  // detect.sh: exit 0 = clean, exit 1 = flip detected.
  const flipDetected = proc.status === 1;
  const stderr = (proc.stderr ?? '').trim();
  const stdout = (proc.stdout ?? '').trim();
  return {
    flip_detected: flipDetected,
    frames_analyzed: 3, // detect.sh always samples 3 frames at 10/50/90%
    reason: flipDetected ? (stderr || stdout || 'card-flip pattern matched') : 'clean',
  };
}

export default detectCardFlip;
