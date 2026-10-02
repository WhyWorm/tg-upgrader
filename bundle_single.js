import fs from 'fs';
import path from 'path';

const base = 'C:/Users/User/.gemini/antigravity/scratch/tg-upgrader/dist';
const html = fs.readFileSync(path.join(base, 'index.html'), 'utf8');

// Find css and js files dynamically
const assetsDir = path.join(base, 'assets');
const files = fs.readdirSync(assetsDir);
const cssFile = files.find(f => f.endsWith('.css'));
const jsFile = files.find(f => f.endsWith('.js'));

const css = fs.readFileSync(path.join(assetsDir, cssFile), 'utf8');
const js = fs.readFileSync(path.join(assetsDir, jsFile), 'utf8');

let standalone = html
  .replace(/<link rel="stylesheet"[^>]*>/, `<style>${css}</style>`)
  .replace(/<script type="module"[^>]*><\/script>/, `<script type="module">${js.replace(/<\/script>/g, '<\\/script>')}</script>`);

const outPath = 'C:/Users/User/.gemini/antigravity/scratch/tg-upgrader/test.html';
fs.writeFileSync(outPath, standalone, 'utf8');
console.log('SUCCESS: Generated standalone HTML at ' + outPath);
