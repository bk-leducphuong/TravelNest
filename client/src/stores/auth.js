// store/auth.js
export default {
  state: {
    email: '',
    isAuthenticated: false,
  },
  mutations: {
    setEmail(state, email) {
      state.email = email;
    },
    setAuthentication(state, status) {
      state.isAuthenticated = status;
    },
  },
  actions: {
    login({ commit }, { email, isAuthenticated }) {
      commit('setEmail', email);
      commit('setAuthentication', isAuthenticated);
    },
  },
  getters: {
    getEmail(state) {
      return state.email;
    },
    isAuthenticated(state) {
      return state.isAuthenticated;
    },
  },
};
