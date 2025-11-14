import { test, expect } from '@playwright/test';

// List of overlay routes to verify.
const routes = [
  '/overlay-samlet-stilling',
  '/overlay-stilling-heat',
  '/overlay-raekkefoelge',
  '/overlay-rider-presentation',
  '/overlay-rider-run'
];

// Helper to evaluate page metrics.
async function collectMetrics(page) {
  return await page.evaluate(() => {
    const html = document.documentElement;
    const body = document.body;
    const hasVScroll = html.scrollHeight > window.innerHeight || body.scrollHeight > window.innerHeight;
    const hasHScroll = html.scrollWidth > window.innerWidth || body.scrollWidth > window.innerWidth;

    // Find the clamp inner scaled element (first element with a transform matrix).
    const transformed = Array.from(document.querySelectorAll('div')).find(el => {
      const t = getComputedStyle(el).transform;
      return t && t !== 'none' && t.startsWith('matrix');
    });
    let scale = 1;
    if (transformed) {
      const m = getComputedStyle(transformed).transform; // e.g. matrix(a, b, c, d, tx, ty)
      const match = m.match(/matrix\(([^,]+),/);
      if (match) scale = parseFloat(match[1]);
    }

    // Attempt to locate main container width (element with maxWidth ~1880 or bounding width ~1880).
    const candidates = Array.from(document.querySelectorAll('div'));
    let containerWidth = 0;
    for (const el of candidates) {
      const cs = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      if ((cs.maxWidth === '1880px' || Math.abs(rect.width - 1880) <= 2) && rect.width > containerWidth) {
        containerWidth = rect.width;
      }
    }

    if (containerWidth === 0) {
      containerWidth = document.body.getBoundingClientRect().width;
    }
    return { hasVScroll, hasHScroll, scale, containerWidth, viewport: { w: window.innerWidth, h: window.innerHeight } };
  });
}

for (const route of routes) {
  test(`Overlay verification: ${route}`, async ({ page }) => {
    await page.goto(route);
    await page.waitForLoadState('networkidle');
    // Extra settle time for dynamic layout clamp.
    await page.waitForTimeout(1000);

    // If a table is expected, wait (samlet-stilling, stilling-heat, raekkefoelge).
    if (route !== '/overlay-rider-presentation' && route !== '/overlay-rider-run') {
      await page.waitForSelector('table', { timeout: 5000 });
    }

    const metrics = await collectMetrics(page);

    // Assertions.
    expect(metrics.hasVScroll, 'No vertical scrollbar expected').toBeFalsy();
    expect(metrics.hasHScroll, 'No horizontal scrollbar expected').toBeFalsy();
    expect(metrics.viewport.w).toBe(1920);
    expect(metrics.viewport.h).toBe(1080);
  expect(metrics.scale).toBeGreaterThanOrEqual(0.98); // allow minor downscale if height exceeds (clamp)
  expect(metrics.scale).toBeLessThanOrEqual(1.001);
    if (route !== '/overlay-rider-run') {
      expect(Math.abs(metrics.containerWidth - 1880)).toBeLessThanOrEqual(4);
    } else {
      // Rider run overlay may not stretch fully; ensure within reasonable bounds.
      expect(metrics.containerWidth).toBeGreaterThanOrEqual(1400);
      expect(metrics.containerWidth).toBeLessThanOrEqual(1880);
    }
  });
}
