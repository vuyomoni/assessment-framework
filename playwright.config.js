// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',

  timeout: 45 * 1000,

  expect: {
    timeout: 10 * 1000
  },

  // Development settings
  fullyParallel: false,
  workers: 1,

  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,

  reporter: [
    ['list'],

    [
      'html',
      {
        outputFolder: 'playwright-report',
        open: 'never'
      }
    ],

    [
      'monocart-reporter',
      {
        name: 'Assessment Framework',
        outputFile: './monocart-report/index.html',

        columns: [
          'project',
          'suite',
          'title',
          'status',
          'duration'
        ],

        trend: false,
        charts: true,
        timeline: true
      }
    ]
  ],

  use: {
    baseURL: 'https://www.saucedemo.com',

    trace: 'on-first-retry',

    screenshot: 'only-on-failure',

    video: 'retain-on-failure'
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome']
      }
    }
  ]
});