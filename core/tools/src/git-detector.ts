/**
 * Git 检测器
 * 检测项目是否使用 Git，并获取相关状态
 */

export interface GitStatus {
  available: boolean;
  branch?: string;
  commit?: string;
  clean?: boolean;
  uncommittedChanges?: string[];
}

export async function detectGit(projectPath: string): Promise<boolean> {
  try {
    const { execSync } = await import('child_process');
    execSync('git rev-parse --git-dir', { cwd: projectPath, stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

export async function getGitStatus(projectPath: string): Promise<GitStatus> {
  const available = await detectGit(projectPath);
  if (!available) return { available: false };

  try {
    const { execSync } = await import('child_process');
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: projectPath, encoding: 'utf-8' }).trim();
    const commit = execSync('git rev-parse HEAD', { cwd: projectPath, encoding: 'utf-8' }).trim();
    const statusOutput = execSync('git status --porcelain', { cwd: projectPath, encoding: 'utf-8' }).trim();
    const uncommittedChanges = statusOutput ? statusOutput.split('\n').map(line => line.substring(3)) : [];
    return { available: true, branch, commit, clean: uncommittedChanges.length === 0, uncommittedChanges };
  } catch {
    return { available: false };
  }
}
