const playwright = require('playwright');

(async () => {
  const browser = await playwright.chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();
  
  const pages = [
    { url: 'http://localhost:3000/overlay-rider-presentation', file: 'rider-presentation.png' },
    { url: 'http://localhost:3000/overlay-samlet-stilling', file: 'samlet-stilling.png' },
    { url: 'http://localhost:3000/overlay-stilling-heat', file: 'stilling-heat.png' },
    { url: 'http://localhost:3000/overlay-raekkefoelge', file: 'raekkefoelge.png' }
  ];
  
  for (const { url, file } of pages) {
    await page.goto(url);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: file, fullPage: false });
    console.log(`Screenshot saved to ${file}`);
  }
  
  await browser.close();
})();
