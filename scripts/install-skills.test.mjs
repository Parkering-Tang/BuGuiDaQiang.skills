import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const installer = join(root, 'scripts/install-skills.sh');
const skillNames = ['assess', 'clarify', 'implement', 'rollback', 'safe', 'schema-guard', 'scope-guard', 'verify'];

function temporary(t) {
  const folder = mkdtempSync(join(tmpdir(), 'buguidaqiang-install-'));
  t.after(() => rmSync(folder, { recursive: true, force: true }));
  return folder;
}

test('installs all eight complete skills into a path containing spaces', t => {
  const destination = join(temporary(t), 'demo project', '.claude', 'skills');
  execFileSync('sh', [installer, destination]);
  assert.deepEqual(readdirSync(destination).sort(), skillNames);
  for (const name of skillNames) {
    const installed = readFileSync(join(destination, name, 'SKILL.md'), 'utf8');
    assert.equal(installed, readFileSync(join(root, 'pure-prompts/skills', name, 'SKILL.md'), 'utf8'));
    assert.match(installed, new RegExp(`^---\\nname: ${name}\\n`));
  }
});

test('rejects a collision before copying any skill', t => {
  const destination = join(temporary(t), 'skills');
  mkdirSync(join(destination, 'safe'), { recursive: true });
  writeFileSync(join(destination, 'safe/SKILL.md'), 'user-owned skill');
  const result = spawnSync('sh', [installer, destination]);
  assert.equal(result.status, 1);
  assert.deepEqual(readdirSync(destination), ['safe']);
  assert.equal(readFileSync(join(destination, 'safe/SKILL.md'), 'utf8'), 'user-owned skill');
});

test('rejects a dangling symlink at a skill name', t => {
  const destination = join(temporary(t), 'skills');
  mkdirSync(destination);
  symlinkSync(join(destination, 'missing'), join(destination, 'safe'));
  assert.equal(spawnSync('sh', [installer, destination]).status, 1);
  assert.deepEqual(readdirSync(destination), ['safe']);
});

test('requires an explicit destination', () => {
  assert.equal(spawnSync('sh', [installer]).status, 2);
});
