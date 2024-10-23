// store/user.js
export default {
  namespaced: true,
  state: {
    userLocation: null,
  },
  mutations: {
    setUserLocation(state, location) {
      state.userLocation = location;
    },
  },
  actions: {
    updateUserLocation({ commit }, location) {
      commit('setUserLocation', location);
    },
  },
  getters: {
    getUserLocation(state) {
      return state.userLocation;
    },
  },
};
