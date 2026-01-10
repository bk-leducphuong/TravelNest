import http from './http'

export const HotelService = {
  getHotelDetails(hotelId, params = {}) {
    return http.get(`/api/hotels/${hotelId}`, { params })
  },

  searchAvailableRooms(hotelId, params) {
    return http.get(`/api/hotels/${hotelId}/rooms`, { params })
  },

  checkRoomAvailability(hotelId, params) {
    // The selectedRooms parameter might need to be stringified if it's an array of objects.
    // The backend seems to expect a JSON string or array of objects.
    // The http client should handle this correctly if `params.selectedRooms` is an array.
    if (params.selectedRooms && Array.isArray(params.selectedRooms)) {
      params.selectedRooms = JSON.stringify(params.selectedRooms)
    }
    return http.get(`/api/hotels/${hotelId}/rooms/availability`, {
      params
    })
  }
}
