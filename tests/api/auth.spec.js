const { test, expect } = require('@playwright/test');
const { BookerApiClient } = require('../../utils/apiClient');

test.describe('API | Authentication', () => {
  test('can generate authentication token', async ({ request }) => {
    const apiClient = new BookerApiClient(request);

    const response = await apiClient.createToken();
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body).toHaveProperty('token');
    expect(typeof body.token).toBe('string');
    expect(body.token.length).toBeGreaterThan(0);
  });
});
