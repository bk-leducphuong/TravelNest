// store/index.js

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
    }
  },
  getters: {
    getBookingInfor(state) {
      return state.bookingInfor
    }
  }
}
