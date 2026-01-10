import http from './http'

export const HomeService = {
  getRecentViewedHotels(hotelIds = []) {
    const params = hotelIds.length > 0 ? { hotelIds: JSON.stringify(hotelIds) } : {}
    return http.get('/api/home/recent-viewed-hotels', { params })
  },

  recordHotelView(hotelId) {
    return http.post('/api/home/recent-viewed-hotels', { hotelId })
  },

  getRecentSearches(limit) {
    return http.get('/api/home/recent-searches', { params: { limit } })
  },

  removeRecentSearch(searchId) {
    return http.delete(`/api/home/recent-searches/${searchId}`)
  },

  getPopularPlaces(limit) {
    return http.get('/api/home/popular-places', { params: { limit } })
  },

  getNearbyHotels(params) {
    return http.get('/api/home/nearby-hotels', { params })
  },

  getTopRatedHotels(params) {
    return http.get('/api/home/top-rated-hotels', { params })
  },

  getRecentlyViewedHotelsDetails(limit) {
    return http.get('/api/home/recently-viewed-hotels', { params: { limit } })
  },

  getPopularDestinations(params) {
    return http.get('/api/home/popular-destinations', { params })
  },

  getTrendingHotels(params) {
    return http.get('/api/home/trending-hotels', { params })
  }
}
