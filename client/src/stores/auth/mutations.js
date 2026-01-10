export default {
  // common (regular user and admin)
  setEmail(state, email) {
    state.email = email
  },
  setUserId(state, userId) {
    state.userId = userId
  },
  setAuthentication(state, status) {
    state.isAuthenticated = status
  },
  setUserRole(state, role) {
    state.role = role
  },
  setLoginFailure(state, status) {
    state.loginFailure = status
  }
}
