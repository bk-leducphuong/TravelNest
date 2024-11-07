export default {
  namespaced: true,
  state: {
    searchData: {
      location: '',
      dateRange: '',
      adults: 2,
      children: 0,
      rooms: 1
    }
  },
  mutations: {
    setLocation(state, location) {
      state.searchData.location = location
    },
    setDateRange(state, dateRange) {
      state.searchData.dateRange = dateRange
    },
    setAdults(state, adults) {
      state.searchData.adults = adults
    },
    setChildren(state, children) {
      state.searchData.children = children
    },
    setRooms(state, rooms) {
      state.searchData.rooms = rooms
    }
  },
  actions: {
    updateLocation({ commit }, location) {
      commit('setLocation', location)
    },
    updateDateRange({ commit }, dateRange) {
      commit('setDateRange', dateRange)
    },
    updateAdults({ commit }, adults) {
      commit('setAdults', adults)
    },
    updateChildren({ commit }, children) {
      commit('setChildren', children)
    },
    updateRooms({ commit }, rooms) {
      commit('setRooms', rooms)
    }
  },
  getters: {
    getSearchData(state) {
      return state.searchData
    }
  }
}
