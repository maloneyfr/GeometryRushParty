const fs = require('fs');
const path = require('path');

const fontPath = path.join(__dirname, 'BurbankBigCondensed-Bold.otf');
const buttonPath = path.join(__dirname, 'button_bg.png');

const fontBase64 = fs.readFileSync(fontPath).toString('base64');
const buttonBase64 = fs.readFileSync(buttonPath).toString('base64');

fs.writeFileSync(
  path.join(__dirname, 'assets_b64.json'),
  JSON.stringify({
    fontBase64,
    buttonBase64
  })
);

console.log('Successfully generated assets_b64.json:');
console.log('Font base64 size:', fontBase64.length, 'chars');
console.log('Button base64 size:', buttonBase64.length, 'chars');
