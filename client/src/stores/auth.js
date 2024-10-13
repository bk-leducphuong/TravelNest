// store/modules/auth.js
export default {
  state: {
    email: null,
    isAuthenticated: false
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
      state.isAuthenticated = true;
    },
    LOGOUT(state) {
      state.user = null;
      state.isAuthenticated = false;
    }
  },
  actions: {
    login({ commit }, userData) {
      // Make API call to login and then commit the user
      commit('SET_USER', userData);
    },
    logout({ commit }) {
      // Call API to log out, then clear user state
      commit('LOGOUT');
    }
  },
  getters: {
    isAuthenticated: (state) => state.isAuthenticated,
    user: (state) => state.user
  }
};
