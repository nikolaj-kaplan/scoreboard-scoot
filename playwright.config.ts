import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 45000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:3000',
    viewport: { width: 1920, height: 1080 },
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    timeout: 120000,
    reuseExistingServer: false
  },
  reporter: [['list']]
});
