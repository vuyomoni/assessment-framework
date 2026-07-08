const { test, expect } = require('@playwright/test');
const { BookerApiClient } = require('../../utils/apiClient');
const { createBookingData, createUpdatedBookingData } = require('../../data/bookingData');

test.describe('API | Booking CRUD Operations', () => {
  test('can create, read, update, partially update and delete a booking', async ({ request }) => {
    const apiClient = new BookerApiClient(request);

    const tokenResponse = await apiClient.createToken();
    expect(tokenResponse.status()).toBe(200);
    const { token } = await tokenResponse.json();

    const bookingData = createBookingData();
    const createResponse = await apiClient.createBooking(bookingData);
    expect(createResponse.status()).toBe(200);

    const createBody = await createResponse.json();
    expect(createBody).toHaveProperty('bookingid');
    expect(createBody.booking.firstname).toBe(bookingData.firstname);
    expect(createBody.booking.lastname).toBe(bookingData.lastname);

    const bookingId = createBody.bookingid;

    const getResponse = await apiClient.getBooking(bookingId);
    expect(getResponse.status()).toBe(200);
    const getBody = await getResponse.json();
    expect(getBody.firstname).toBe(bookingData.firstname);
    expect(getBody.lastname).toBe(bookingData.lastname);
    expect(getBody.bookingdates.checkin).toBe(bookingData.bookingdates.checkin);

    const updatedBookingData = createUpdatedBookingData();
    const updateResponse = await apiClient.updateBooking(bookingId, token, updatedBookingData);
    expect(updateResponse.status()).toBe(200);
    const updateBody = await updateResponse.json();
    expect(updateBody.firstname).toBe(updatedBookingData.firstname);
    expect(updateBody.totalprice).toBe(updatedBookingData.totalprice);

    const patchResponse = await apiClient.partialUpdateBooking(bookingId, token, {
      additionalneeds: 'Dinner'
    });
    expect(patchResponse.status()).toBe(200);
    const patchBody = await patchResponse.json();
    expect(patchBody.additionalneeds).toBe('Dinner');

    const deleteResponse = await apiClient.deleteBooking(bookingId, token);
    expect(deleteResponse.status()).toBe(201);

    const verifyDeleteResponse = await apiClient.getBooking(bookingId);
    expect(verifyDeleteResponse.status()).toBe(404);
  });

  test('rejects reading a non-existing booking', async ({ request }) => {
    const apiClient = new BookerApiClient(request);

    const response = await apiClient.getBooking(999999999);

    expect(response.status()).toBe(404);
  });
});
