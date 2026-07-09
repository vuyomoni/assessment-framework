const { test, expect } = require('@playwright/test');
const { ApiClient } = require('../../utils/apiClient');
const bookingData = require('../../data/api/bookingData.json');

test.describe('API Authentication', () => {
  test('Create token with valid credentials', async ({ request }) => {
    const apiClient = new ApiClient(request);

    const response = await apiClient.createToken(bookingData.authentication);

    expect(response.status).toBe(bookingData.expectedResponses.authStatus);
    expect(response.body).toHaveProperty('token');
    expect(response.body.token).toBeTruthy();
  });

  test('Reject token creation with invalid credentials', async ({ request }) => {
    const apiClient = new ApiClient(request);

    const response = await apiClient.createToken({
      username: 'invalid_user',
      password: 'invalid_password'
    });

    expect(response.status).toBe(bookingData.expectedResponses.authStatus);
    expect(response.body).toHaveProperty('reason');
    expect(response.body.reason).toBe('Bad credentials');
  });
});