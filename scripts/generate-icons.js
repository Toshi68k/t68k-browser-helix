import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import zlib from 'zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assetsDir = path.resolve(__dirname, '../src/assets');

if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Write SVG
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b224c" />
      <stop offset="50%" stop-color="#1e1e2e" />
      <stop offset="100%" stop-color="#141423" />
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#b4befe" />
      <stop offset="100%" stop-color="#89b4fa" />
    </linearGradient>
    <linearGradient id="purple" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#cba6f7" />
      <stop offset="100%" stop-color="#a6e3a1" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>
  <!-- Background rounded rect -->
  <rect x="8" y="8" width="112" height="112" rx="26" fill="url(#grad)" stroke="#45475a" stroke-width="2" filter="url(#shadow)"/>
  
  <!-- Helix Double Strands / H Symbol -->
  <!-- Left Column -->
  <rect x="34" y="30" width="14" height="68" rx="7" fill="url(#accent)" />
  <!-- Right Column -->
  <rect x="80" y="30" width="14" height="68" rx="7" fill="url(#accent)" />
  <!-- Diagonal / Bridge Strand -->
  <path d="M 38 42 C 60 48, 68 80, 90 86" stroke="url(#purple)" stroke-width="12" stroke-linecap="round" fill="none"/>
  <!-- Status dot -->
  <circle cx="98" cy="32" r="6" fill="#a6e3a1"/>
</svg>`;

fs.writeFileSync(path.join(assetsDir, 'icon.svg'), svgContent, 'utf-8');

// Pure Node.js uncompressed / standard PNG encoder
function createPNG(size) {
  const width = size;
  const height = size;
  const buffer = Buffer.alloc(width * height * 4);

  // Background colors & Helix symbol rendering in pure pixels
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const nx = x / width;
      const ny = y / height;

      // Rounded box bounds
      const cornerRadius = 0.2;
      const dx = Math.max(0, Math.abs(nx - 0.5) - (0.5 - cornerRadius));
      const dy = Math.max(0, Math.abs(ny - 0.5) - (0.5 - cornerRadius));
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > cornerRadius) {
        // Transparent outside rounded box
        buffer[idx] = 0;
        buffer[idx + 1] = 0;
        buffer[idx + 2] = 0;
        buffer[idx + 3] = 0;
        continue;
      }

      // Default background color: #1e1e2e (Dark Slate/Purple)
      let r = 30 + Math.floor(nx * 20);
      let g = 30 + Math.floor(ny * 15);
      let b = 46 + Math.floor((nx + ny) * 20);
      let a = 255;

      // Draw H lines
      const isLeftCol = (nx >= 0.26 && nx <= 0.38 && ny >= 0.22 && ny <= 0.78);
      const isRightCol = (nx >= 0.62 && nx <= 0.74 && ny >= 0.22 && ny <= 0.78);
      
      // Diagonal ribbon
      const diagTarget = 0.35 + (nx - 0.3) * 0.55;
      const isDiag = (nx >= 0.28 && nx <= 0.72 && Math.abs(ny - diagTarget) <= 0.08);

      if (isLeftCol || isRightCol) {
        r = 180;
        g = 190;
        b = 254; // #b4befe
      } else if (isDiag) {
        r = 203;
        g = 166;
        b = 247; // #cba6f7
      }

      // Small mode indicator dot at top-right
      const dotDist = Math.hypot(nx - 0.78, ny - 0.24);
      if (dotDist < 0.06) {
        r = 166;
        g = 227;
        b = 161; // #a6e3a1 green
      }

      buffer[idx] = r;
      buffer[idx + 1] = g;
      buffer[idx + 2] = b;
      buffer[idx + 3] = a;
    }
  }

  return encodePNG(width, height, buffer);
}

function encodePNG(width, height, rgbaBuffer) {
  // Raw scanlines with filter byte 0
  const scanlines = Buffer.alloc(height * (width * 4 + 1));
  let scanOffset = 0;
  let rgbaOffset = 0;

  for (let y = 0; y < height; y++) {
    scanlines[scanOffset++] = 0; // Filter: None
    rgbaBuffer.copy(scanlines, scanOffset, rgbaOffset, rgbaOffset + width * 4);
    scanOffset += width * 4;
    rgbaOffset += width * 4;
  }

  const compressedData = zlib.deflateSync(scanlines);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth
  ihdr[9] = 6; // Color type: RGBA
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(len + 12);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);

  const crcTarget = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = crc32(crcTarget);
  chunk.writeUInt32BE(crc, len + 8);
  return chunk;
}

function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[i] = c >>> 0;
}

// Generate 16, 48, 128
[16, 48, 128].forEach(size => {
  const png = createPNG(size);
  fs.writeFileSync(path.join(assetsDir, `icon${size}.png`), png);
  console.log(`Generated icon${size}.png (${size}x${size})`);
});
