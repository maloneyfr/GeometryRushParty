// Builds dist/geometry-rush-party.js and extension.js — the single file you load into TurboWarp.
// Usage: node build.js
const fs = require('fs');
const path = require('path');

const root = __dirname;
const read = (f, enc) => fs.readFileSync(path.join(root, f), enc);

const src = read('src/extension.src.js', 'utf8');
const font = read('assets/BurbankBigCondensed-Bold.otf').toString('base64');
const button = read('assets/button.png').toString('base64');
const peerjs = read('assets/peerjs.min.js', 'utf8').replace(/\/\/# sourceMappingURL=.*$/m, '');
const partyHtml = JSON.stringify(read('party.html', 'utf8'));

for (const token of ['__FONT_B64__', '__BUTTON_B64__', '__PARTY_HTML__', '/*__PEERJS__*/']) {
  if (!src.includes(token)) throw new Error('Missing placeholder ' + token);
}

// Function replacers so "$" sequences inside the payloads are not interpreted.
const out = src
  .replace('__FONT_B64__', () => font)
  .replace('__BUTTON_B64__', () => button)
  .replace('__PARTY_HTML__', () => partyHtml)
  .replace('/*__PEERJS__*/', () => peerjs);

fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
const destDist = path.join(root, 'dist', 'geometry-rush-party.js');
const destRoot = path.join(root, 'extension.js');

fs.writeFileSync(destDist, out, 'utf8');
fs.writeFileSync(destRoot, out, 'utf8');

console.log('Built', destDist, '(' + Math.round(out.length / 1024) + ' KB)');
console.log('Built', destRoot, '(' + Math.round(out.length / 1024) + ' KB)');
