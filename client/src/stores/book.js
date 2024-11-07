// store/index.js

export default {
  namespaced: true,
  state: {
    bookInfor: null // Store selected bookInfor  here
  },
  mutations: {
    setBookInfor(state, bookInfor) {
      state.bookInfor = bookInfor
    }
  },
  actions: {
    bookHotel({ commit }, bookInfor) {
      commit('setBookInfor', bookInfor)
    }
  },
  getters: {
    getBookInfor(state) {
      return state.bookInfor
    }
  }
}
