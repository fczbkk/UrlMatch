import * as esbuild from 'esbuild';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Get all .ts files in src directory recursively
function getAllSourceFiles(dir) {
  const files = [];
  const items = readdirSync(dir);

  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...getAllSourceFiles(fullPath));
    } else if (item.endsWith('.ts')) {
      files.push(fullPath);
    }
  }

  return files;
}

const sourceFiles = getAllSourceFiles('src');

// Build library (CommonJS for backward compatibility)
await esbuild.build({
  entryPoints: sourceFiles,
  outdir: 'lib',
  format: 'cjs',
  platform: 'node',
  target: 'node18',
  outExtension: { '.js': '.js' },
  footer: {
    js: 'if (module.exports.default) module.exports = module.exports.default;'
  }
});

console.log('✓ CommonJS build to lib/');

// Build library (ESM for modern usage)
await esbuild.build({
  entryPoints: sourceFiles,
  outdir: 'esm',
  format: 'esm',
  platform: 'node',
  target: 'node18',
  outExtension: { '.js': '.js' }
});

console.log('✓ ESM build to esm/');

// Generate TypeScript declarations (shared by both CJS and ESM)
await execAsync('npx tsc --emitDeclarationOnly --declaration --declarationMap --outDir lib');
console.log('✓ Type declarations generated');

// Build docs bundle (IIFE for browser)
await esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: 'docs/url-match.js',
  format: 'iife',
  globalName: 'UrlMatch',
  platform: 'browser',
  target: 'es2020'
});

console.log('✓ Docs bundle built to docs/url-match.js');
