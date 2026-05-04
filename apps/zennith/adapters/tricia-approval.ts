/**
 * Tricia approval adapter — posts a review request to the dashboard's
 * approval queue and waits (or returns pending) for verdict.
 *
 * Posts to the dashboard /api/approval/request endpoint (default
 * http://100.78.69.119:3099). Tricia approves/rejects in the dashboard UI;
 * the verdict is logged via emit.sh as an artifact event.
 *
 * v0.1: fire-and-return (pending). Polling is the caller's responsibility.
 *
 *   // import type { AgentAdapter, ApprovalRequest } from '@zennith-studio/contracts';
 */
import { spawnSync } from 'node:child_process';

const DASHBOARD =
  process.env.ZENNITH_DASHBOARD_URL ?? 'http://100.78.69.119:3099';

export interface ApprovalRequest {
  artifactId: string;
  brand: string;
  artifactPath: string;
  reviewer?: 'tricia' | 'yivonne' | 'jenn';
  reason?: string;
}

export interface ApprovalResult {
  request_id: string;
  status: 'pending' | 'approved' | 'rejected' | 'error';
  url: string;
}

export const triciaApproval = {
  id: 'tricia-approval',
  displayName: 'Tricia Approval Flow',
  request(req: ApprovalRequest): ApprovalResult {
    const body = JSON.stringify({
      artifact_id: req.artifactId,
      brand: req.brand,
      artifact_path: req.artifactPath,
      reviewer: req.reviewer ?? 'tricia',
      reason: req.reason ?? '',
    });
    // TODO: replace with native fetch once Node 20+ is the floor.
    const proc = spawnSync(
      'curl',
      ['-sS', '-X', 'POST', '-H', 'Content-Type: application/json',
        '-d', body, `${DASHBOARD}/api/approval/request`],
      { encoding: 'utf-8', timeout: 15_000 },
    );
    const stdout = (proc.stdout ?? '').trim();
    try {
      const parsed = JSON.parse(stdout);
      return {
        request_id: String(parsed.request_id ?? ''),
        status: (parsed.status ?? 'pending') as ApprovalResult['status'],
        url: `${DASHBOARD}/approvals/${parsed.request_id ?? ''}`,
      };
    } catch {
      return { request_id: '', status: 'error', url: `${DASHBOARD}/approvals` };
    }
  },
};

export default triciaApproval;
