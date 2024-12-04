// This store will be used to store booking information when user make a booking
import axios from 'axios'
export default {
  namespaced: true,
  state: {
    bookingInfor: null // Store selected bookingInfor  here
  },
  mutations: {
    setBookingInfor(state, bookingInfor) {
      state.bookingInfor = bookingInfor
    }
  },
  actions: {
    booking({ commit }, bookingInfor) {
      commit('setBookingInfor', bookingInfor)
    },
    // check if room is available or not before booking the room
    async checkRoomAvailability({ commit, state}) {
      try {
        // check if room is available or not
        const response = await axios.post('http://localhost:3000/api/hotels/check-room-availability', {
          bookingInfor: state.bookingInfor
        })
        return response.data.isAvailable
      }catch(error) {
        console.log(error)
      }
    }
  },
  getters: {
    getBookingInfor(state) {
      return state.bookingInfor
    }
  }
}
