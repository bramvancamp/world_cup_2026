import sharp from 'sharp';
import { mkdirSync } from 'fs';

// Soccer ball on dark navy background, matching the site's design system.
// Center pentagon + 5 seam lines + 5 outer patch "D-shapes" clipped to ball circle.
// Outer patch circles are centered just outside the ball radius so the clip
// shows only the inner crescent — the classic soccer ball silhouette.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" width="180" height="180">
  <defs>
    <radialGradient id="bg" cx="30%" cy="25%" r="75%">
      <stop offset="0%" stop-color="#0f1e3a"/>
      <stop offset="100%" stop-color="#07090f"/>
    </radialGradient>
    <radialGradient id="ball" cx="36%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="60%" stop-color="#f4f8ff"/>
      <stop offset="100%" stop-color="#c4d4e4"/>
    </radialGradient>
    <clipPath id="clip">
      <circle cx="90" cy="90" r="56"/>
    </clipPath>
  </defs>

  <!-- Dark navy background -->
  <rect width="180" height="180" fill="url(#bg)"/>

  <!-- Teal ambient glow ring -->
  <circle cx="90" cy="90" r="66" fill="rgba(0,212,170,0.07)"/>

  <!-- Ball -->
  <circle cx="90" cy="90" r="56" fill="url(#ball)"/>

  <!-- Soccer patches — clipped to ball circle -->
  <g clip-path="url(#clip)" fill="#1a2a3a">
    <!-- Center pentagon (vertices at r=19, pointing up) -->
    <polygon points="90,71 108,84 101,105 79,105 72,84"/>

    <!-- 5 outer patch circles centred just outside the ball edge.
         The clip cuts each to a "D" shape — exactly how outer pentagons
         appear on a real ball viewed from the front. -->
    <circle cx="128" cy="37"  r="21"/>
    <circle cx="152" cy="110" r="21"/>
    <circle cx="90"  cy="155" r="21"/>
    <circle cx="28"  cy="110" r="21"/>
    <circle cx="52"  cy="37"  r="21"/>
  </g>

  <!-- Seam lines from pentagon vertices to outer patches — clipped to ball -->
  <g clip-path="url(#clip)" stroke="#1a2a3a" stroke-width="2.5" stroke-linecap="round" fill="none">
    <line x1="90"  y1="71"  x2="90"  y2="34"/>
    <line x1="108" y1="84"  x2="143" y2="72"/>
    <line x1="101" y1="105" x2="123" y2="135"/>
    <line x1="79"  y1="105" x2="57"  y2="135"/>
    <line x1="72"  y1="84"  x2="37"  y2="72"/>
  </g>

  <!-- Ball border — subtle teal ring -->
  <circle cx="90" cy="90" r="56" fill="none" stroke="rgba(0,212,170,0.5)" stroke-width="1.5"/>
</svg>`;

mkdirSync('./public', { recursive: true });

const buf = Buffer.from(svg);

await sharp(buf).resize(180, 180).png().toFile('./public/apple-touch-icon.png');
await sharp(buf).resize(32, 32).png().toFile('./public/favicon.png');

console.log('Icons written to public/');
