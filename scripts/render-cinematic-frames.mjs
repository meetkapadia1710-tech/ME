import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOTAL_FRAMES = 120;
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'cinematic');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
} else {
  const files = fs.readdirSync(OUTPUT_DIR);
  for (const file of files) {
    if (file.endsWith('.webp') || file.endsWith('.jpeg') || file.endsWith('.jpg')) {
      fs.unlinkSync(path.join(OUTPUT_DIR, file));
    }
  }
}

async function renderFrames() {
  console.log('Starting Playwright...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  
  const page = await context.newPage();

  console.log(`Rendering ${TOTAL_FRAMES} frames...`);
  let totalBytes = 0;

  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const url = `http://localhost:3000/cinematic-render?frame=${i}`;
    await page.goto(url, { waitUntil: 'load' });
    await page.waitForTimeout(50); 
    const canvas = page.locator('canvas').last();
    const frameNumber = i.toString().padStart(4, '0');
    // We'll use jpeg with quality 70 for small file size as a proxy for WebP if playwright doesn't support WebP.
    // Let's try jpeg first.
    const outputPath = path.join(OUTPUT_DIR, `frame-${frameNumber}.jpeg`);
    await canvas.screenshot({
      path: outputPath,
      type: 'jpeg',
      quality: 95
    });
    
    const stat = fs.statSync(outputPath);
    totalBytes += stat.size;

    console.log(`Rendered frame ${i+1}/${TOTAL_FRAMES}`);
  }

  await browser.close();
  console.log(`Rendering complete. Total size: ${(totalBytes / 1024 / 1024).toFixed(2)} MB`);
}

renderFrames().catch(console.error);
