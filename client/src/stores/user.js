// store/user.js
export default {
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
