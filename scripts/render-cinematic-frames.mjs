import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { TOTAL_CINEMATIC_FRAMES, cinematicFrameFileName } from '../lib/cinematic.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOTAL_FRAMES = TOTAL_CINEMATIC_FRAMES;
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'cinematic');

/**
 * A blank 1920x1080 JPEG compresses to roughly 1 KB. Real frames of this scene
 * are 12 KB and up, so anything under this is a screenshot taken before the
 * WebGL canvas painted.
 */
const MIN_FRAME_BYTES = 5000;

/**
 * Where the dev server is. Defaults to the usual port, but `next dev` moves to
 * another port when 3000 is taken, which used to leave this script silently
 * screenshotting connection errors.
 *   RENDER_BASE_URL=http://localhost:3001 node scripts/render-cinematic-frames.mjs
 */
const BASE_URL = process.env.RENDER_BASE_URL ?? 'http://localhost:3000';

/**
 * Repair mode: `node scripts/render-cinematic-frames.mjs --only=5,6,10`
 * re-renders just those indices and leaves everything else on disk.
 * Without it, the whole sequence is wiped and re-rendered.
 */
const onlyArg = process.argv.find((a) => a.startsWith('--only='));
const onlyIndices = onlyArg
  ? onlyArg
      .slice('--only='.length)
      .split(',')
      .map((n) => parseInt(n.trim(), 10))
      .filter((n) => Number.isInteger(n) && n >= 0 && n < TOTAL_FRAMES)
  : null;

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
} else if (!onlyIndices) {
  const files = fs.readdirSync(OUTPUT_DIR);
  for (const file of files) {
    if (file.endsWith('.webp') || file.endsWith('.jpeg') || file.endsWith('.jpg')) {
      fs.unlinkSync(path.join(OUTPUT_DIR, file));
    }
  }
}

/**
 * Wait until the WebGL canvas has actually drawn something.
 *
 * The original script used a flat `waitForTimeout(50)`, which silently produced
 * blank frames whenever the scene took longer than that to paint — 15 of 120 on
 * one run. Poll the canvas contents instead and only proceed once the image is
 * both non-trivial and stable between samples.
 *
 * Relies on `preserveDrawingBuffer: true` in app/cinematic-render/page.tsx,
 * without which toDataURL returns an empty buffer.
 */
async function waitForCanvasPaint(page, timeoutMs = 8000) {
  const start = Date.now();
  let previous = 0;

  while (Date.now() - start < timeoutMs) {
    const length = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return 0;
      try {
        return canvas.toDataURL('image/jpeg', 0.6).length;
      } catch {
        return 0;
      }
    });

    // Non-trivial and unchanged since the last sample => finished painting.
    if (length > 3000 && length === previous) return true;
    previous = length;
    await page.waitForTimeout(100);
  }

  return false;
}

async function renderFrames() {
  const targets = onlyIndices ?? Array.from({ length: TOTAL_FRAMES }, (_, i) => i);

  console.log('Starting Playwright...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });

  const page = await context.newPage();

  console.log(
    onlyIndices
      ? `Repairing ${targets.length} frame(s): ${targets.join(', ')}`
      : `Rendering ${TOTAL_FRAMES} frames...`
  );

  const suspect = [];

  for (let n = 0; n < targets.length; n++) {
    const i = targets[n];
    const url = `${BASE_URL}/cinematic-render?frame=${i}`;
    const outputPath = path.join(OUTPUT_DIR, cinematicFrameFileName(i));

    // Two attempts: a blank canvas is usually a timing fluke that a reload fixes.
    let size = 0;
    for (let attempt = 1; attempt <= 2; attempt++) {
      await page.goto(url, { waitUntil: 'load' });
      const painted = await waitForCanvasPaint(page);

      const canvas = page.locator('canvas').last();
      await canvas.screenshot({ path: outputPath, type: 'jpeg', quality: 95 });

      size = fs.statSync(outputPath).size;
      if (painted && size >= MIN_FRAME_BYTES) break;

      if (attempt === 1) {
        console.warn(`  frame ${i}: ${size} bytes, retrying...`);
      }
    }

    if (size < MIN_FRAME_BYTES) suspect.push(i);
    console.log(`Rendered frame ${n + 1}/${targets.length} (index ${i}, ${size} bytes)`);
  }

  await browser.close();

  // Validate the WHOLE sequence, not just what this run touched. A partial or
  // blank-frame render is how this broke before: the script stopped at 66 of
  // 120 and exited quietly, so nobody noticed until the frames 404'd in prod.
  const missing = [];
  const blank = [];
  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const p = path.join(OUTPUT_DIR, cinematicFrameFileName(i));
    if (!fs.existsSync(p)) missing.push(i);
    else if (fs.statSync(p).size < MIN_FRAME_BYTES) blank.push(i);
  }

  if (missing.length || blank.length) {
    if (missing.length) {
      console.error(`\nMISSING ${missing.length} frame(s): ${missing.join(', ')}`);
    }
    if (blank.length) {
      console.error(
        `\nBLANK ${blank.length} frame(s) under ${MIN_FRAME_BYTES} bytes: ${blank.join(', ')}`
      );
      console.error(
        `Repair with: node scripts/render-cinematic-frames.mjs --only=${blank.join(',')}`
      );
    }
    process.exitCode = 1;
    return;
  }

  const totalBytes = Array.from({ length: TOTAL_FRAMES }, (_, i) =>
    fs.statSync(path.join(OUTPUT_DIR, cinematicFrameFileName(i))).size
  ).reduce((a, b) => a + b, 0);

  console.log(
    `\nAll ${TOTAL_FRAMES} frames present and non-blank. Total size: ${(totalBytes / 1024 / 1024).toFixed(2)} MB`
  );
}

renderFrames().catch((err) => {
  console.error(err);
  // Exit non-zero so an interrupted render can't pass for a successful one.
  process.exitCode = 1;
});
