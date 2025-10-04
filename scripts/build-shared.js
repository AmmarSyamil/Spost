#!/usr/bin/env node
/**
 * scripts/build-shared.js
 *
 * Copies src/ -> build/chrome and build/firefox, then writes the right manifest.json
 * Usage: node scripts/build-shared.js
 *
 * Notes:
 * - Assumes folder layout:
 *   - src/
 *   - manifests/manifest.chrome.json
 *   - manifests/manifest.firefox.json
 *   - build/ (will be created if missing)
 *
 * - Excludes node_modules, .git, .DS_Store
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const stat = promisify(fs.stat);
const mkdir = promisify(fs.mkdir);
const readdir = promisify(fs.readdir);
const copyFile = promisify(fs.copyFile);
const unlink = promisify(fs.unlink);
const rmdir = promisify(fs.rmdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const MANIFESTS = path.join(ROOT, 'manifests');
const BUILD = path.join(ROOT, 'build');

const IGNORES = new Set(['node_modules', '.git', '.DS_Store']);

async function ensureDir(dir) {
  try {
    await mkdir(dir, { recursive: true });
  } catch (e) {
    if (e.code !== 'EEXIST') throw e;
  }
}

async function rimraf(dir) {
  try {
    const entries = await readdir(dir);
    await Promise.all(entries.map(async (entry) => {
      const full = path.join(dir, entry);
      const s = await stat(full);
      if (s.isDirectory()) {
        await rimraf(full);
      } else {
        await unlink(full);
      }
    }));
    await rmdir(dir);
  } catch (e) {
    if (e.code !== 'ENOENT') throw e;
  }
}

async function copyRecursive(src, dest) {
  if (fs.promises && fs.promises.cp) {
    await fs.promises.cp(src, dest, { recursive: true, errorOnExist: false });
    return;
  }

  const s = await stat(src);
  if (s.isDirectory()) {
    await ensureDir(dest);
    const entries = await readdir(src);
    for (const entry of entries) {
      if (IGNORES.has(entry)) continue;
      const from = path.join(src, entry);
      const to = path.join(dest, entry);
      const st = await stat(from);
      if (st.isDirectory()) {
        await copyRecursive(from, to);
      } else {
        await ensureDir(path.dirname(to));
        await copyFile(from, to);
      }
    }
  } else {
    await ensureDir(path.dirname(dest));
    await copyFile(src, dest);
  }
}

async function buildTarget(targetName, manifestFile) {
  const targetDir = path.join(BUILD, targetName);
  await rimraf(targetDir).catch(() => {});
  await ensureDir(targetDir);

  await copyRecursive(SRC, targetDir);

  const manifestPath = path.join(MANIFESTS, manifestFile);
  const manifestDest = path.join(targetDir, 'manifest.json');

  try {
    const m = await readFile(manifestPath, 'utf8');
    await writeFile(manifestDest, m, 'utf8');
  } catch (e) {
    throw new Error(`Failed to copy manifest ${manifestPath}: ${e.message}`);
  }

  console.log(`[build] ${targetName} built to ${targetDir}`);
}

async function main() {
  try {
    await ensureDir(BUILD);
    await buildTarget('chrome', 'manifest.chrome.json');
    await buildTarget('firefox', 'manifest.firefox.json');
    console.log('[build] done');
  } catch (err) {
    console.error('[build] error:', err);
    process.exit(1);
  }
}

main();
