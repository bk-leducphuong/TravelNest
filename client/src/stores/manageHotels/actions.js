// store/manageHotels/actions.js
import { AdminService } from '@/services/admin.service'

export default {
  async getAllManagingHotels({ commit }) {
    const response = await AdminService.getAllManagingHotels()
    commit('setManagingHotels', response.data.managingHotels)
  },
  async selectHotelToManage({ commit }, hotelId) {
    commit('setCurrentManagingHotelId', hotelId)
    commit('setCurrentManagingHotelInformation', hotelId)
  },
  validateHotel({ commit, state }, { hotelId }) {
    for (const hotel of state.managingHotels) {
      if (hotel.hotel_id == hotelId) {
        commit('setCurrentManagingHotelId', hotelId)
        return true
      }
    }
    return false
  }
}
