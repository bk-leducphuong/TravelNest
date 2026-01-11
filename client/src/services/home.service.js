import http from './http';

export const HomeService = {
  // Get recent viewed hotels
  // API: GET /api/home/recent-viewed-hotels (with optional hotelIds query param for non-authenticated)
  getRecentViewedHotels(params = {}) {
    return http.get('/api/home/recent-viewed-hotels', { params });
  },

  // Record hotel view
  // API: POST /api/home/recent-viewed-hotels
  recordHotelView(hotelId) {
    return http.post('/api/home/recent-viewed-hotels', { hotelId });
  },

  // Get recent searches
  // API: GET /api/home/recent-searches (with optional limit query param)
  getRecentSearches(limit) {
    return http.get('/api/home/recent-searches', { params: { limit } });
  },

  // Remove recent search
  // API: DELETE /api/home/recent-searches/:searchId
  removeRecentSearch(searchId) {
    return http.delete(`/api/home/recent-searches/${searchId}`);
  },

  // Get popular places
  // API: GET /api/home/popular-places (with optional limit query param)
  getPopularPlaces(limit) {
    return http.get('/api/home/popular-places', { params: { limit } });
  },

  // Get nearby hotels
  // API: GET /api/home/nearby-hotels (with latitude, longitude, radius query params)
  getNearbyHotels(params) {
    return http.get('/api/home/nearby-hotels', { params });
  },

  // Get recently viewed hotels with full details (authenticated)
  // API: GET /api/home/recently-viewed-hotels (with optional limit query param)
  getRecentlyViewedHotelsDetails(limit) {
    return http.get('/api/home/recently-viewed-hotels', { params: { limit } });
  },

  // Get top rated hotels
  // API: GET /api/home/top-rated-hotels (with optional limit, minRating, minReviews query params)
  getTopRatedHotels(params) {
    return http.get('/api/home/top-rated-hotels', { params });
  },

  // Get popular destinations
  // API: GET /api/home/popular-destinations (with optional limit, minHotels query params)
  getPopularDestinations(params) {
    return http.get('/api/home/popular-destinations', { params });
  },

  // Get trending hotels
  // API: GET /api/home/trending-hotels (with optional limit, days query params)
  getTrendingHotels(params) {
    return http.get('/api/home/trending-hotels', { params });
  },
};
