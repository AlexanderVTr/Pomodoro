import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const iconsDir = path.join(root, "public", "icons");

const tomato = "#d95550";
const ring = "#ffffff22";

async function createIcon(size, filename) {
  const svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" rx="${Math.floor(size * 0.18)}" fill="${tomato}"/>
    <circle cx="${size / 2}" cy="${size / 2}" r="${size * 0.28}" fill="none" stroke="${ring}" stroke-width="${Math.max(2, size * 0.04)}"/>
    <line x1="${size / 2}" y1="${size / 2}" x2="${size / 2}" y2="${size * 0.32}" stroke="#fff" stroke-width="${Math.max(2, size * 0.03)}" stroke-linecap="round"/>
    <line x1="${size / 2}" y1="${size / 2}" x2="${size * 0.62}" y2="${size / 2}" stroke="#fff" stroke-width="${Math.max(2, size * 0.025)}" stroke-linecap="round"/>
  </svg>`;

  await sharp(Buffer.from(svg)).png().toFile(path.join(iconsDir, filename));
}

mkdirSync(iconsDir, { recursive: true });

await createIcon(192, "icon-192.png");
await createIcon(512, "icon-512.png");
await createIcon(512, "icon-maskable-512.png");
await createIcon(180, "apple-touch-icon.png");

console.log("Icons written to public/icons/");
