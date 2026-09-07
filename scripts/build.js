import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Sync version from package.json to manifest.json
const pkgPath = path.join(rootDir, 'package.json');
const manifestPath = path.join(rootDir, 'manifest.json');

if (fs.existsSync(pkgPath) && fs.existsSync(manifestPath)) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

  if (pkg.version) {
    // Chrome manifest 'version' only supports 1-4 dot-separated integers (e.g. '1.0.0').
    // Strip pre-release suffixes (e.g. '-beta.1', '-rc.2') for manifest.version,
    // and use the full string for manifest.version_name if present.
    const cleanVersion = (pkg.version || '').split('-')[0].replace(/[^0-9.]/g, '');
    let changed = false;

    if (manifest.version !== cleanVersion) {
      manifest.version = cleanVersion;
      changed = true;
    }

    if (pkg.version !== cleanVersion) {
      if (manifest.version_name !== pkg.version) {
        manifest.version_name = pkg.version;
        changed = true;
      }
    } else if (manifest.version_name) {
      delete manifest.version_name;
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf-8');
      console.log(`Synced manifest.json version to ${cleanVersion}${manifest.version_name ? ` (version_name: ${manifest.version_name})` : ''}`);
    }
  }
}

// Read CSS file to inline
const cssContent = fs.readFileSync(path.join(rootDir, 'src/content/styles/helix.css'), 'utf-8');

// Build standalone content script
const filesToBundle = [
  'src/content/navigation/jump-list.js',
  'src/content/navigation/cli-utils.js',
  'src/content/navigation/scroller.js',
  'src/content/navigation/traversal.js',
  'src/content/navigation/visual-caret.js',
  'src/content/ui/shadow-root.js',
  'src/content/ui/statusline.js',
  'src/content/ui/which-key.js',
  'src/content/ui/reader.js',
  'src/content/ui/hints.js',
  'src/content/ui/search-bar.js',
  'src/content/ui/command-bar.js',
  'src/content/ui/tab-picker.js',
  'src/content/state.js',
  'src/content/keymap/helix-keys.js',
  'src/content/index.js'
];

let bundledCode = `/**
 * T68k Browser Helix - Bundled Standalone Content Script
 * Generated: ${new Date().toISOString()}
 */
(function() {
'use strict';

const INLINED_HELIX_CSS = ${JSON.stringify(cssContent)};

`;

for (const relPath of filesToBundle) {
  const fullPath = path.join(rootDir, relPath);
  let content = fs.readFileSync(fullPath, 'utf-8');

  // Strip all import statements
  content = content.replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?/g, '');
  // Strip export keywords
  content = content.replace(/export\s+(const|let|var|function|class|async\s+function)\s+/g, '$1 ');
  content = content.replace(/export\s*\{\s*[^}]*\s*\};?/g, '');
  content = content.replace(/export\s+default\s+/g, '');

  bundledCode += `\n/* ========== FILE: ${relPath} ========== */\n` + content + '\n';
}

bundledCode += `\n})();\n`;

fs.writeFileSync(path.join(distDir, 'content.js'), bundledCode, 'utf-8');
console.log(`Successfully built dist/content.js (${(bundledCode.length / 1024).toFixed(1)} KB)`);
