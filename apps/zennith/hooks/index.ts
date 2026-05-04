/**
 * Zennith open-design hooks — entry point.
 *
 * Each hook wraps a proven Zennith bash script and exposes a typed function
 * for the open-design composer to call at the right pre/post-flight moment.
 * See docs/skills-protocol.md for hook contract semantics.
 */
export { emitArtifact, default as artifactBus } from './artifact-bus';
export type { ArtifactBusInput, ArtifactType } from './artifact-bus';

export { mintAdId, default as adIdMint } from './ad-id-mint';
export type { AdIdMintInput, AdIdMintResult, Channel } from './ad-id-mint';

export { calibrationGate } from './calibration-gate';
export type { CalibrationGateResult } from './calibration-gate';

export { detectCardFlip, default as videoCardFlip } from './video-card-flip';
export type { VideoCardFlipInput, VideoCardFlipResult } from './video-card-flip';
