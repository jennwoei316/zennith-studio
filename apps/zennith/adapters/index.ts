/**
 * Zennith open-design adapters — entry point.
 * Each adapter wraps a downstream agent or workflow exposed through the
 * agent-adapter contract in docs/agent-adapters.md.
 */
export { dreami, default as dreamiAdapter } from './dreami';
export type { DreamiTask, DreamiRunInput, DreamiResult } from './dreami';

export { zenni, default as zenniAdapter } from './zenni';
export type { ZenniRouteInput, ZenniRouteResult } from './zenni';

export { triciaApproval, default as triciaApprovalAdapter } from './tricia-approval';
export type { ApprovalRequest, ApprovalResult } from './tricia-approval';
