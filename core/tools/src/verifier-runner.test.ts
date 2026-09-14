import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { ProjectInfo } from './project-analyzer';
import { runVerification } from './verifier-runner';

let directory: string;

beforeEach(() => {
  directory = fs.mkdtempSync(path.join(os.tmpdir(), 'buguidaqiang-verifier-'));
  fs.writeFileSync(path.join(directory, 'pass.cjs'), "console.log('fixture passed');\n");
  fs.writeFileSync(path.join(directory, 'fail.cjs'), 'process.exitCode = 1;\n');
});

afterEach(() => fs.rmSync(directory, { recursive: true, force: true }));

function project(commands: Partial<ProjectInfo> = {}): ProjectInfo {
  return { type: 'node', name: 'fixture', rootPath: directory, hasGit: false, hasTests: false, ...commands };
}

test('an unconfigured project is unverified, not passed', async () => {
  const report = await runVerification(project());
  expect(report.passed).toBe(false);
  expect(report.results).toHaveLength(1);
  expect(report.results[0].status).toBe('skipped');
});

test('configured successful commands are executed', async () => {
  const report = await runVerification(project({ buildCommand: 'node pass.cjs', testCommand: 'node pass.cjs' }));
  expect(report.passed).toBe(true);
  expect(report.results.map(result => result.status)).toEqual(['passed', 'passed']);
});

test('a failing build does not prevent the test result being reported', async () => {
  const report = await runVerification(project({ buildCommand: 'node fail.cjs', testCommand: 'node pass.cjs' }));
  expect(report.passed).toBe(false);
  expect(report.results.map(result => result.status)).toEqual(['failed', 'passed']);
});

test('a failing test makes the report fail', async () => {
  const report = await runVerification(project({ testCommand: 'node fail.cjs' }));
  expect(report.passed).toBe(false);
  expect(report.results[0].status).toBe('failed');
});

test('a missing script is a failure rather than a skipped check', async () => {
  const report = await runVerification(project({ testCommand: 'node missing.cjs' }));
  expect(report.passed).toBe(false);
  expect(report.results[0].status).toBe('failed');
});
