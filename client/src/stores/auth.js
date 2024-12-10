// store/auth.js
import axios from 'axios'
import router from '@/router/index'

export default {
  namespaced: true,
  state: {
    email: '',
    userId: null, // customer id or partner id
    role: '', // customer, partner 
    isAuthenticated: false,
    loginFailure: false,
  },
  mutations: {
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
    },
  },
  actions: {
    // login for regular user
    async login({ commit }, { apiUrl, payload, redirectRoute }) {
      try {
        const response = await axios.post(apiUrl, payload, { withCredentials: true })
        if (response.data.success) {
          commit('setUserId', response.data.userId)
          commit('setEmail', payload.email)
          commit('setAuthentication', true)
          commit('setUserRole', payload.userRole)
          commit('setLoginFailure', false)
          // Check for redirect query and navigate accordingly
          router.push(redirectRoute)
        }
      } catch (error) {
        commit('setLoginFailure', true)
        router.push('/login')
      }
    },
    // common
    async logout({ commit }, { haveRedirect }) {
      // Perform logout logic (e.g., API call)
      try {
        await axios.post('http://localhost:3000/api/auth/logout', {}, { withCredentials: true })
        // After successful logout, reset authentication state
        commit('setAuthentication', false)
        if (haveRedirect) {
          window.location.href = '/'
        }
      } catch (error) {
        console.error('Logout failed:', error)
      }
    },
    async checkAuth({ commit }) {
      const response = await axios.get('http://localhost:3000/api/auth/check-auth', {
        withCredentials: true
      })
      if (response.data.isAuthenticated) {
        commit('setAuthentication', true) 
        commit('setUserId', response.data.userId)
        if (response.data.userRole === 'customer') {
          commit('setUserRole', response.data.userRole)
        } else if (response.data.userRole === 'partner') {
          commit('setUserRole', response.data.userRole)
        }
      } else {
        commit('setAuthentication', false) // Reset state if not authenticated
      }
    },
    // for admin
    async loginAdmin({ commit }, { apiUrl, payload }) {
      try {
        const response = await axios.post(apiUrl, payload, { withCredentials: true })
        if (response.data.success) {
          commit('setUserId', response.data.userId)
          commit('setEmail', payload.email)
          commit('setAuthentication', true)
          commit('setUserRole', payload.userRole)
          commit('setLoginFailure', false)
          // Check for redirect query and navigate accordingly
          router.replace('/admin/hotels-management')
        }
      } catch (error) {
        console.log('Login or register failed! Pls try again!', error)
        commit('setLoginFailure', true)
      }
    },
  },
  getters: {
    getUserId(state) {
      return state.userId
    },
    getEmail(state) {
      return state.email
    },
    isAdminAuthenticated(state) {
      if (state.isAuthenticated && state.role == 'partner') {
        return true
      }else {
        return false
      }
    },

    isUserAuthenticated(state) {
      if (state.isAuthenticated && state.role == 'customer') {
        return true
      }else {
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
}
