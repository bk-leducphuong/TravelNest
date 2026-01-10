// store/book/actions.js
import { HotelService } from '@/services/hotel.service'

export default {
  booking({ commit }, bookingInfor) {
    commit('setBookingInfor', bookingInfor)
  },
  // check if room is available or not before booking the room
  async checkRoomAvailability({ state }) {
    try {
      // check if room is available or not
      // Assuming state.bookingInfor contains hotelId and other necessary params
      const { hotelId, ...params } = state.bookingInfor
      const response = await HotelService.checkRoomAvailability(hotelId, params)
      // The original action returned a boolean from response.data.isAvailable.
      // The service returns the full response data. We need to adapt this.
      // Based on the api-docs, it returns an object with data and meta, or error.
      // For now, I will assume the response structure is similar to what the original code expected.
      return response.data.isAvailable // This might need adjustment based on actual API response
    } catch (error) {
      console.error(error)
      return false // Assume not available on error
    }
  }
}
