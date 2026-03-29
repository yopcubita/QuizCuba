const svg2img = require('svg2img');
const fs = require('fs');

const svg = `<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="1024" height="1024">
  <rect width="1024" height="1024" rx="220" fill="#0D1B2A"/>
  <circle cx="512" cy="460" r="330" fill="#CC1C2A"/>
  <circle cx="512" cy="460" r="250" fill="#1A3A6B"/>
  <text x="512" y="560" text-anchor="middle" font-family="Georgia, serif" font-size="340" font-weight="bold" fill="white">Q</text>
  <rect x="600" y="555" width="100" height="50" rx="25" fill="#FF3344" transform="rotate(45 650 580)"/>
  <polygon points="512,170 532,230 595,230 545,268 565,328 512,290 459,328 479,268 429,230 492,230" fill="white"/>
  <text x="512" y="830" text-anchor="middle" font-family="Arial, sans-serif" font-size="85" font-weight="bold" fill="white" letter-spacing="6">QUIZ CUBA</text>
</svg>`;

svg2img(svg, { width: 1024, height: 1024 }, function(error, buffer) {
  if (error) { console.log('Error:', error); return; }
  fs.writeFileSync('./assets/icon.png', buffer);
  console.log('Icono generado correctamente en assets/icon.png');
});
