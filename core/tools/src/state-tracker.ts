/**
 * 状态追踪器
 * 管理会话状态和请求历史
 */

import * as fs from 'fs';
import * as path from 'path';

const SAFE_DIR = '.safe-vibecoding';

export type Complexity = 'trivial' | 'moderate' | 'complex' | 'high-risk';
export type RequestStatus = 'pending' | 'in_progress' | 'completed' | 'rolled_back' | 'cancelled';

export interface GateStatus {
  clarify: boolean;
  scopeGuard: boolean;
  architectureReview: boolean;
  schemaGuard: boolean;
  impactCheck: boolean;
  rollbackSafety: boolean;
  safeImplement: boolean;
  verifyDone: boolean;
}

export interface Request {
  id: string;
  original: string;
  clarified: string;
  complexity: Complexity;
  status: RequestStatus;
  gates: GateStatus;
  affectedFiles: string[];
  risks: string[];
  snapshotId: string | null;
  createdAt: string;
  completedAt: string | null;
}

export interface Session {
  id: string;
  projectPath: string;
  createdAt: string;
  currentRequest: Request | null;
  history: Request[];
}

function ensureDir(projectPath: string): string {
  const dir = path.join(projectPath, SAFE_DIR);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function generateId(): string {
  const now = new Date();
  return `req-${now.toISOString().slice(0,10).replace(/-/g,'')}-${now.toTimeString().slice(0,8).replace(/:/g,'')}`;
}

export function loadSession(projectPath: string): Session {
  ensureDir(projectPath);
  const sessionPath = path.join(projectPath, SAFE_DIR, 'session.json');
  if (!fs.existsSync(sessionPath)) {
    return { id: `session-${Date.now()}`, projectPath, createdAt: new Date().toISOString(), currentRequest: null, history: [] };
  }
  try { return JSON.parse(fs.readFileSync(sessionPath, 'utf-8')); } 
  catch { return { id: `session-${Date.now()}`, projectPath, createdAt: new Date().toISOString(), currentRequest: null, history: [] }; }
}

export function saveSession(session: Session): void {
  ensureDir(session.projectPath);
  fs.writeFileSync(path.join(session.projectPath, SAFE_DIR, 'session.json'), JSON.stringify(session, null, 2));
}

export function createRequest(projectPath: string, original: string): Request {
  const session = loadSession(projectPath);
  const request: Request = {
    id: generateId(), original, clarified: '', complexity: 'moderate', status: 'pending',
    gates: { clarify: false, scopeGuard: false, architectureReview: false, schemaGuard: false, impactCheck: false, rollbackSafety: false, safeImplement: false, verifyDone: false },
    affectedFiles: [], risks: [], snapshotId: null, createdAt: new Date().toISOString(), completedAt: null
  };
  session.currentRequest = request;
  saveSession(session);
  return request;
}

export function updateGate(projectPath: string, gate: keyof GateStatus, passed: boolean): Request | null {
  const session = loadSession(projectPath);
  if (!session.currentRequest) return null;
  session.currentRequest.gates[gate] = passed;
  saveSession(session);
  return session.currentRequest;
}
