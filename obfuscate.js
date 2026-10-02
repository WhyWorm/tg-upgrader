import fs from 'fs';
import path from 'path';
import JavaScriptObfuscator from 'javascript-obfuscator';

const distDir = 'C:/Users/User/.gemini/antigravity/scratch/tg-upgrader/dist';
const assetsDir = path.join(distDir, 'assets');

console.log('--- Starting Heavy Code Obfuscation ---');

const files = fs.readdirSync(assetsDir);
const jsFiles = files.filter(f => f.endsWith('.js'));

for (const jsFile of jsFiles) {
  const fullPath = path.join(assetsDir, jsFile);
  console.log(`Encrypting & Obfuscating: ${jsFile}...`);
  const code = fs.readFileSync(fullPath, 'utf8');

  const obfuscatedResult = JavaScriptObfuscator.obfuscate(code, {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 1.0,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.35,
    stringArray: true,
    stringArrayEncoding: ['rc4', 'base64'],
    stringArrayThreshold: 1.0,
    stringArrayRotate: true,
    stringArrayShuffle: true,
    stringArrayWrappersCount: 3,
    stringArrayWrappersChainedCalls: true,
    splitStrings: true,
    splitStringsChunkLength: 4,
    transformObjectKeys: true,
    numbersToExpressions: true,
    selfDefending: true,
    simplify: false,
    renameGlobals: false,
    identifierNamesGenerator: 'hexadecimal'
  });

  const obfuscatedCode = obfuscatedResult.getObfuscatedCode();
  fs.writeFileSync(fullPath, obfuscatedCode, 'utf8');
  console.log(`[OK] Successfully encrypted ${jsFile} (Output size: ${obfuscatedCode.length} bytes)`);
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
