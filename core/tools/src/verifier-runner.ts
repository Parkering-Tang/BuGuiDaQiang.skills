/**
 * 验证执行器
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { ProjectInfo } from './project-analyzer';

export interface VerifyResult {
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  message: string;
  duration: number;
}

export interface VerifyReport {
  passed: boolean;
  results: VerifyResult[];
  summary: string;
}

function runCommand(command: string, cwd: string, timeout: number = 120000): { success: boolean; output: string; duration: number } {
  const start = Date.now();
  try {
    return { success: true, output: execSync(command, { cwd, encoding: 'utf-8', timeout, stdio: 'pipe' }), duration: Date.now() - start };
  } catch (e: any) {
    return { success: false, output: e.stdout || e.stderr || e.message, duration: Date.now() - start };
  }
}

export async function runVerification(projectInfo: ProjectInfo): Promise<VerifyReport> {
  const results: VerifyResult[] = [];
  
  if (projectInfo.buildCommand) {
    const r = runCommand(projectInfo.buildCommand, projectInfo.rootPath);
    results.push({ name: '构建', status: r.success ? 'passed' : 'failed', message: r.success ? '构建成功' : '构建失败', duration: r.duration });
  }
  
  if (projectInfo.testCommand) {
    const r = runCommand(projectInfo.testCommand, projectInfo.rootPath, 300000);
    let msg = r.success ? '测试通过' : '测试失败';
    const match = r.output.match(/(\d+)\s+passed/);
    if (match) msg = `${match[1]} 个测试通过`;
    results.push({ name: '测试', status: r.success ? 'passed' : 'failed', message: msg, duration: r.duration });
  }

  const passedCount = results.filter(r => r.status === 'passed').length;
  const failedCount = results.filter(r => r.status === 'failed').length;
  const summary = failedCount === 0 ? `验证通过：${passedCount} 项` : `验证失败：${failedCount} 项失败`;
  return { passed: failedCount === 0, results, summary };
}
