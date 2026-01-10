import http from './http'

export const BookingService = {
  getBookings(includeCancelled = false) {
    return http.get('/api/bookings', {
      params: { includeCancelled }
    })
  },

  getBookingById(bookingId) {
    return http.get(`/api/bookings/${bookingId}`)
  },

  getBookingByCode(bookingCode) {
    return http.get(`/api/bookings/code/${bookingCode}`)
  },

  cancelBooking(bookingId, processRefund = false) {
    return http.delete(`/api/bookings/${bookingId}`, {
      params: { processRefund }
    })
  }
}
