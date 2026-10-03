import fs from 'fs';
import path from 'path';
import JavaScriptObfuscator from 'javascript-obfuscator';

const distDir = 'C:/Users/User/.gemini/antigravity/scratch/tg-upgrader/dist';
const assetsDir = path.join(distDir, 'assets');

console.log('--- Starting High-Performance Code Obfuscation ---');

const files = fs.readdirSync(assetsDir);
const jsFiles = files.filter(f => f.endsWith('.js'));

for (const jsFile of jsFiles) {
  const fullPath = path.join(assetsDir, jsFile);
  console.log(`Encrypting & Protecting: ${jsFile}...`);
  const code = fs.readFileSync(fullPath, 'utf8');

  const obfuscatedResult = JavaScriptObfuscator.obfuscate(code, {
    compact: true,
    stringArray: true,
    stringArrayEncoding: ['base64'],
    stringArrayThreshold: 0.8,
    stringArrayRotate: true,
    stringArrayShuffle: true,
    stringArrayWrappersCount: 1,
    splitStrings: false,
    transformObjectKeys: false,
    identifierNamesGenerator: 'hexadecimal',
    controlFlowFlattening: false,
    deadCodeInjection: false,
    numbersToExpressions: false,
    selfDefending: false,
    simplify: true
  });

  const obfuscatedCode = obfuscatedResult.getObfuscatedCode();
  fs.writeFileSync(fullPath, obfuscatedCode, 'utf8');
  console.log(`[OK] Successfully encrypted ${jsFile} (Optimized size: ${obfuscatedCode.length} bytes)`);
}

// Re-generate test.html with the encrypted code
console.log('Re-bundling encrypted standalone test.html...');
const htmlPath = path.join(distDir, 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const cssFile = files.find(f => f.endsWith('.css'));
const primaryJs = jsFiles[0];

const css = fs.readFileSync(path.join(assetsDir, cssFile), 'utf8');
const encryptedJs = fs.readFileSync(path.join(assetsDir, primaryJs), 'utf8');

let standalone = html
  .replace(/<link rel="stylesheet"[^>]*>/, `<style>${css}</style>`)
  .replace(/<script type="module"[^>]*><\/script>/, `<script type="module">${encryptedJs.replace(/<\/script>/g, '<\\/script>')}</script>`);

const outTestPath = 'C:/Users/User/.gemini/antigravity/scratch/tg-upgrader/test.html';
fs.writeFileSync(outTestPath, standalone, 'utf8');
console.log(`[OK] Standalone encrypted HTML created at: ${outTestPath}`);
console.log('--- Obfuscation Complete ---');
