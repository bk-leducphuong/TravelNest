import http from './http'

export const AdminService = {
  getAllManagingHotels() {
    return http.get('/api/admin/hotels-management')
  }
}
