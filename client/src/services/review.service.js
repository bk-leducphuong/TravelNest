import http from './http'

export const ReviewService = {
  getReviews() {
    return http.get('/api/reviews')
  },

  getHotelReviews(hotelId, params = {}) {
    return http.get(`/api/reviews/hotels/${hotelId}`, { params })
  },

  validateReview(params) {
    return http.get('/api/reviews/validate', { params })
  },

  checkReview(params) {
    return http.get('/api/reviews/check', { params })
  },

  createReview(reviewData) {
    return http.post('/api/reviews', reviewData)
  }
}
