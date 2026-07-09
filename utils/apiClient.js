const { expect } = require('@playwright/test');

class ApiClient {
  constructor(request, baseUrl = 'https://restful-booker.herokuapp.com') {
    this.request = request;
    this.baseUrl = baseUrl;
  }

  async buildResponse(response) {
    let body = null;

    try {
      body = await response.json();
    } catch {
      body = await response.text();
    }

    return {
      status: response.status(),
      ok: response.ok(),
      body
    };
  }

  async createToken(credentials) {
    const response = await this.request.post(`${this.baseUrl}/auth`, {
      data: credentials
    });

    return this.buildResponse(response);
  }

  async createBooking(bookingPayload) {
    const response = await this.request.post(`${this.baseUrl}/booking`, {
      data: bookingPayload
    });

    return this.buildResponse(response);
  }

  async getBooking(bookingId) {
    const response = await this.request.get(`${this.baseUrl}/booking/${bookingId}`);

    return this.buildResponse(response);
  }

  async updateBooking(bookingId, token, bookingPayload) {
    const response = await this.request.put(`${this.baseUrl}/booking/${bookingId}`, {
      headers: {
        Cookie: `token=${token}`
      },
      data: bookingPayload
    });

    return this.buildResponse(response);
  }

  async partialUpdateBooking(bookingId, token, partialPayload) {
    const response = await this.request.patch(`${this.baseUrl}/booking/${bookingId}`, {
      headers: {
        Cookie: `token=${token}`
      },
      data: partialPayload
    });

    return this.buildResponse(response);
  }

  async deleteBooking(bookingId, token) {
    const response = await this.request.delete(`${this.baseUrl}/booking/${bookingId}`, {
      headers: {
        Cookie: `token=${token}`
      }
    });

    return this.buildResponse(response);
  }
}

module.exports = { ApiClient };