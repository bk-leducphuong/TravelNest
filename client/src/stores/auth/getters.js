export default {
  getUserId(state) {
    return state.userId
  },
  getEmail(state) {
    return state.email
  },
  isAdminAuthenticated(state) {
    if (state.isAuthenticated && state.role == 'partner') {
      return true
    } else {
      return false
    }
  },

  isUserAuthenticated(state) {
    if (state.isAuthenticated && state.role == 'customer') {
      return true
    } else {
      return false
    }
  },
  getUserRole(state) {
    return state.role
  },
  isLoginFail(state) {
    return state.loginFailure
  }
}
