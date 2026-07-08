function createBookingData(overrides = {}) {
  return {
    firstname: 'Cecil',
    lastname: 'Moni',
    totalprice: 2500,
    depositpaid: true,
    bookingdates: {
      checkin: '2026-08-01',
      checkout: '2026-08-05'
    },
    additionalneeds: 'Breakfast',
    ...overrides
  };
}

function createUpdatedBookingData() {
  return createBookingData({
    firstname: 'Vuyo',
    lastname: 'Automation',
    totalprice: 3200,
    depositpaid: false,
    additionalneeds: 'Late checkout'
  });
}

module.exports = {
  createBookingData,
  createUpdatedBookingData
};
