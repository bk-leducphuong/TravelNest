export default {
  namespaced: true,
  state: {
    searchData: null // Store selected searchData here
  },
  mutations: {
    setSearchData(state, searchData) {
      state.searchData = searchData
    }
  },
  actions: {
    searchHotel({ commit }, searchData) {
      commit('setSearchData', searchData)
    }
  },
  getters: {
    getSearchData(state) {
      return state.searchData
    }
  }
}
