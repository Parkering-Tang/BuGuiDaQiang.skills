/**
 * 项目分析器
 */

import * as fs from 'fs';
import * as path from 'path';

export interface ProjectInfo {
  type: 'node' | 'python' | 'rust' | 'go' | 'unknown';
  name: string;
  rootPath: string;
  hasGit: boolean;
  hasTests: boolean;
  buildCommand?: string;
  testCommand?: string;
}

export function detectProjectType(projectPath: string): ProjectInfo['type'] {
  if (fs.existsSync(path.join(projectPath, 'package.json'))) return 'node';
  if (fs.existsSync(path.join(projectPath, 'pyproject.toml')) || fs.existsSync(path.join(projectPath, 'setup.py'))) return 'python';
  if (fs.existsSync(path.join(projectPath, 'Cargo.toml'))) return 'rust';
  if (fs.existsSync(path.join(projectPath, 'go.mod'))) return 'go';
  return 'unknown';
}

export async function analyzeProject(projectPath: string): Promise<ProjectInfo> {
  const type = detectProjectType(projectPath);
  const info: ProjectInfo = { type, name: path.basename(projectPath), rootPath: projectPath, hasGit: fs.existsSync(path.join(projectPath, '.git')), hasTests: false };
  
  if (type === 'node') {
    const pkgPath = path.join(projectPath, 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      info.buildCommand = pkg.scripts?.build ? 'npm run build' : undefined;
      info.testCommand = pkg.scripts?.test ? 'npm test' : undefined;
      info.hasTests = !!pkg.scripts?.test;
    }
  } else if (type === 'python') {
    info.testCommand = 'pytest';
    info.hasTests = fs.existsSync(path.join(projectPath, 'tests')) || fs.existsSync(path.join(projectPath, 'test'));
  } else if (type === 'rust') {
    info.buildCommand = 'cargo build';
    info.testCommand = 'cargo test';
    info.hasTests = true;
  }
  return info;
}
