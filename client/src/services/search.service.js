import http from './http'

export const SearchService = {
  searchHotels(params) {
    return http.get('/api/search', { params })
  },

  saveSearch(searchData) {
    return http.post('/api/search', { searchData })
  }
}
