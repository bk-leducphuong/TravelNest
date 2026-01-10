import http from './http'

export const PaymentService = {
  getPayments(params = {}) {
    return http.get('/api/payments', { params })
  },

  createPaymentIntent(paymentData) {
    return http.post('/api/payments', paymentData)
  },

  getPaymentByBookingId(bookingId) {
    return http.get(`/api/payments/bookings/${bookingId}`)
  },

  getPaymentByTransactionId(transactionId) {
    return http.get(`/api/payments/transactions/${transactionId}`)
  }
}
