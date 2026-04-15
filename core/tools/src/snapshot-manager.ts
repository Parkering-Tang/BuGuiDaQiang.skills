/**
 * 快照管理器
 * 创建、管理和恢复文件快照
 */

import * as fs from 'fs';
import * as path from 'path';
import { createHash } from 'crypto';

export interface SnapshotFile {
  path: string;
  patch: string | null;
  originalHash: string | null;
  operation: 'modify' | 'create' | 'delete';
}

export interface SnapshotManifest {
  id: string;
  createdAt: string;
  reason: string;
  requestId: string;
  gitAvailable: boolean;
  gitCommit?: string;
  files: SnapshotFile[];
}

const SAFE_DIR = '.safe-vibecoding';

function ensureDir(projectPath: string): string {
  const dir = path.join(projectPath, SAFE_DIR, 'snapshots');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function generateId(): string {
  const now = new Date();
  return `snap-${now.toISOString().slice(0,10).replace(/-/g,'')}-${now.toTimeString().slice(0,8).replace(/:/g,'')}`;
}

function hashFile(filePath: string): string {
  return createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

export async function createSnapshot(
  projectPath: string,
  files: string[],
  reason: string,
  requestId: string,
  gitAvailable: boolean = false,
  gitCommit?: string
): Promise<SnapshotManifest> {
  const snapshotsDir = ensureDir(projectPath);
  const snapshotId = generateId();
  const snapshotDir = path.join(snapshotsDir, snapshotId);
  const patchesDir = path.join(snapshotDir, 'patches');
  
  fs.mkdirSync(snapshotDir, { recursive: true });
  fs.mkdirSync(patchesDir, { recursive: true });

  const snapshotFiles: SnapshotFile[] = files.map(file => {
    const absolutePath = path.resolve(projectPath, file);
    if (!fs.existsSync(absolutePath)) {
      return { path: file, patch: null, originalHash: null, operation: 'create' as const };
    }
    const originalHash = hashFile(absolutePath);
    const patchFileName = file.replace(/[\/\\]/g, '_') + '.patch';
    fs.writeFileSync(path.join(patchesDir, patchFileName), fs.readFileSync(absolutePath, 'utf-8'));
    return { path: file, patch: patchFileName, originalHash: `sha256:${originalHash}`, operation: 'modify' as const };
  });

  const manifest: SnapshotManifest = { id: snapshotId, createdAt: new Date().toISOString(), reason, requestId, gitAvailable, gitCommit, files: snapshotFiles };
  fs.writeFileSync(path.join(snapshotDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
  return manifest;
}

export async function restoreSnapshot(projectPath: string, snapshotId: string): Promise<{ success: boolean; restoredFiles: string[]; errors: string[] }> {
  const manifestPath = path.join(projectPath, SAFE_DIR, 'snapshots', snapshotId, 'manifest.json');
  if (!fs.existsSync(manifestPath)) return { success: false, restoredFiles: [], errors: [`快照 ${snapshotId} 不存在`] };
  
  const manifest: SnapshotManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  const patchesDir = path.join(projectPath, SAFE_DIR, 'snapshots', snapshotId, 'patches');
  const restoredFiles: string[] = [];
  const errors: string[] = [];

  for (const file of manifest.files) {
    const absolutePath = path.join(projectPath, file.path);
    try {
      if (file.operation === 'modify' && file.patch) {
        fs.writeFileSync(absolutePath, fs.readFileSync(path.join(patchesDir, file.patch), 'utf-8'));
        restoredFiles.push(file.path);
      } else if (file.operation === 'create' && fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
        restoredFiles.push(file.path);
      }
    } catch (error) {
      errors.push(`${file.path}: ${error}`);
    }
  }
  return { success: errors.length === 0, restoredFiles, errors };
}
