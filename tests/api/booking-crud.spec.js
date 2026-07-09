const { test, expect } = require('@playwright/test');
const { ApiClient } = require('../../utils/apiClient');
const bookingData = require('../../data/api/bookingData.json');

function maskSensitiveData(data) {
  return JSON.parse(
    JSON.stringify(data)
      .replace(/"password":\s*"[^"]+"/g, '"password": "********"')
      .replace(/"token":\s*"[^"]+"/g, '"token": "********"')
  );
}

async function attachJson(testInfo, name, data) {
  await testInfo.attach(name, {
    body: JSON.stringify(maskSensitiveData(data), null, 2),
    contentType: 'application/json'
  });
}

test.describe('Booking CRUD API Journey', () => {
  test('Create, retrieve, update, partially update, delete and verify booking', async ({ request }, testInfo) => {
    const apiClient = new ApiClient(request);

    await attachJson(testInfo, 'Auth - Request', bookingData.authentication);
    const authResponse = await apiClient.createToken(bookingData.authentication);
    await attachJson(testInfo, 'Auth - Response', authResponse);

    expect(authResponse.status).toBe(bookingData.expectedResponses.authStatus);
    expect(authResponse.body.token).toBeTruthy();

    const token = authResponse.body.token;

    await attachJson(testInfo, 'Create Booking - Request', bookingData.createBooking);
    const createResponse = await apiClient.createBooking(bookingData.createBooking);
    await attachJson(testInfo, 'Create Booking - Response', createResponse);

    expect(createResponse.status).toBe(bookingData.expectedResponses.createStatus);
    expect(createResponse.body.bookingid).toBeTruthy();
    expect(createResponse.body.booking).toMatchObject(bookingData.createBooking);

    const bookingId = createResponse.body.bookingid;

    await attachJson(testInfo, 'Get Booking - Request', { bookingId });
    const getResponse = await apiClient.getBooking(bookingId);
    await attachJson(testInfo, 'Get Booking - Response', getResponse);

    expect(getResponse.status).toBe(bookingData.expectedResponses.getStatus);
    expect(getResponse.body).toMatchObject(bookingData.createBooking);

    await attachJson(testInfo, 'Update Booking - Request', {
      bookingId,
      token,
      body: bookingData.updateBooking
    });

    const updateResponse = await apiClient.updateBooking(
      bookingId,
      token,
      bookingData.updateBooking
    );

    await attachJson(testInfo, 'Update Booking - Response', updateResponse);

    expect(updateResponse.status).toBe(bookingData.expectedResponses.updateStatus);
    expect(updateResponse.body).toMatchObject(bookingData.updateBooking);

    await attachJson(testInfo, 'Partial Update Booking - Request', {
      bookingId,
      token,
      body: bookingData.partialUpdate
    });

    const patchResponse = await apiClient.partialUpdateBooking(
      bookingId,
      token,
      bookingData.partialUpdate
    );

    await attachJson(testInfo, 'Partial Update Booking - Response', patchResponse);

    expect(patchResponse.status).toBe(bookingData.expectedResponses.partialUpdateStatus);
    expect(patchResponse.body.firstname).toBe(bookingData.partialUpdate.firstname);
    expect(patchResponse.body.additionalneeds).toBe(bookingData.partialUpdate.additionalneeds);

    await attachJson(testInfo, 'Delete Booking - Request', {
      bookingId,
      token
    });

    const deleteResponse = await apiClient.deleteBooking(bookingId, token);
    await attachJson(testInfo, 'Delete Booking - Response', deleteResponse);

    expect(deleteResponse.status).toBe(bookingData.expectedResponses.deleteStatus);

    await attachJson(testInfo, 'Get Deleted Booking - Request', { bookingId });
    const getDeletedResponse = await apiClient.getBooking(bookingId);
    await attachJson(testInfo, 'Get Deleted Booking - Response', getDeletedResponse);

    expect(getDeletedResponse.status).toBe(bookingData.expectedResponses.notFoundStatus);
  });
});