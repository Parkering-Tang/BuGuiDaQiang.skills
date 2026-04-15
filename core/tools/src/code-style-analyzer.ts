/**
 * 代码风格分析器
 */

import * as fs from 'fs';
import * as path from 'path';

export interface CodeStyle {
  indent: 'spaces' | 'tabs';
  indentSize: number;
  quotes: 'single' | 'double';
  semicolons: boolean;
  trailingComma: boolean;
  namingConvention: 'camelCase' | 'snake_case' | 'PascalCase';
  componentStyle: 'function' | 'class';
  asyncStyle: 'async-await' | 'promise' | 'callback';
  importStyle: 'default' | 'named' | 'mixed';
}

export interface StyleIssue {
  line: number;
  rule: string;
  message: string;
  expected: string;
  actual: string;
}

const DEFAULT: CodeStyle = { indent: 'spaces', indentSize: 2, quotes: 'single', semicolons: true, trailingComma: false, namingConvention: 'camelCase', componentStyle: 'function', asyncStyle: 'async-await', importStyle: 'named' };

export function analyzeFileStyle(filePath: string): CodeStyle {
  if (!fs.existsSync(filePath)) throw new Error(`文件不存在: ${filePath}`);
  return inferFromCode(fs.readFileSync(filePath, 'utf-8'));
}

export function analyzeProjectStyle(projectPath: string): CodeStyle {
  const editorStyle = readEditorConfig(projectPath);
  if (editorStyle) return { ...DEFAULT, ...editorStyle };
  const prettierStyle = readPrettierConfig(projectPath);
  if (prettierStyle) return { ...DEFAULT, ...prettierStyle };
  return DEFAULT;
}

export function checkStyleConsistency(code: string, style: CodeStyle): StyleIssue[] {
  const issues: StyleIssue[] = [];
  code.split('\n').forEach((line, i) => {
    if (style.indent === 'tabs' && /^ +/.test(line) && !line.trim().startsWith('//')) {
      issues.push({ line: i + 1, rule: 'indent', message: 'Expected tabs', expected: 'tabs', actual: 'spaces' });
    }
    if (style.quotes === 'single' && /"[^"]*"/.test(line) && !line.includes("'")) {
      issues.push({ line: i + 1, rule: 'quotes', message: 'Expected single quotes', expected: 'single', actual: 'double' });
    }
  });
  return issues;
}

function inferFromCode(code: string): CodeStyle {
  const hasSpaces = /^ {2,}/m.test(code);
  const hasTabs = /^\t+/m.test(code);
  const singleQuotes = (code.match(/'/g) || []).length;
  const doubleQuotes = (code.match(/"/g) || []).length;
  const hasSemicolons = /;\s*$/m.test(code);
  return { ...DEFAULT, indent: hasSpaces ? 'spaces' : hasTabs ? 'tabs' : 'spaces', quotes: singleQuotes >= doubleQuotes ? 'single' : 'double', semicolons: hasSemicolons };
}

function readEditorConfig(projectPath: string): Partial<CodeStyle> | null {
  const p = path.join(projectPath, '.editorconfig');
  if (!fs.existsSync(p)) return null;
  const content = fs.readFileSync(p, 'utf-8');
  const result: Partial<CodeStyle> = {};
  if (/indent_style\s*=\s*tab/i.test(content)) result.indent = 'tabs';
  if (/indent_style\s*=\s*space/i.test(content)) result.indent = 'spaces';
  const sizeMatch = content.match(/indent_size\s*=\s*(\d+)/);
  if (sizeMatch) result.indentSize = parseInt(sizeMatch[1]);
  return result;
}

function readPrettierConfig(projectPath: string): Partial<CodeStyle> | null {
  const files = ['.prettierrc', '.prettierrc.json', 'prettier.config.js'];
  for (const f of files) {
    const p = path.join(projectPath, f);
    if (fs.existsSync(p)) {
      try {
        const config = JSON.parse(fs.readFileSync(p, 'utf-8'));
        const result: Partial<CodeStyle> = {};
        if (config.singleQuote !== undefined) result.quotes = config.singleQuote ? 'single' : 'double';
        if (config.semi !== undefined) result.semicolons = config.semi;
        if (config.tabWidth !== undefined) result.indentSize = config.tabWidth;
        return result;
      } catch {}
    }
  }
  return null;
}

export function formatStyle(style: CodeStyle): string {
  return `缩进: ${style.indent === 'spaces' ? style.indentSize + ' 空格' : 'Tab'}\n引号: ${style.quotes === 'single' ? '单引号' : '双引号'}\n分号: ${style.semicolons ? '使用' : '不使用'}`;
}
