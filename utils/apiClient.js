class BookerApiClient {
  constructor(request, baseURL = 'https://restful-booker.herokuapp.com') {
    this.request = request;
    this.baseURL = baseURL;
  }

  async createToken() {
    const response = await this.request.post(`${this.baseURL}/auth`, {
      data: {
        username: process.env.BOOKER_USERNAME || 'admin',
        password: process.env.BOOKER_PASSWORD || 'password123'
      }
    });
    return response;
  }

  async createBooking(bookingData) {
    return this.request.post(`${this.baseURL}/booking`, { data: bookingData });
  }

  async getBooking(bookingId) {
    return this.request.get(`${this.baseURL}/booking/${bookingId}`);
  }

  async updateBooking(bookingId, token, bookingData) {
    return this.request.put(`${this.baseURL}/booking/${bookingId}`, {
      headers: {
        Cookie: `token=${token}`,
        Accept: 'application/json'
      },
      data: bookingData
    });
  }

  async partialUpdateBooking(bookingId, token, partialData) {
    return this.request.patch(`${this.baseURL}/booking/${bookingId}`, {
      headers: {
        Cookie: `token=${token}`,
        Accept: 'application/json'
      },
      data: partialData
    });
  }

  async deleteBooking(bookingId, token) {
    return this.request.delete(`${this.baseURL}/booking/${bookingId}`, {
      headers: {
        Cookie: `token=${token}`
      }
    });
  }
}

module.exports = { BookerApiClient };
