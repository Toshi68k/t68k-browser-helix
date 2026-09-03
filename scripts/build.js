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
