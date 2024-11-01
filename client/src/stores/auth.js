// store/auth.js
import axios from 'axios'
import router from '@/router/index'

export default {
  namespaced: true,
  state: {
    email: '',
    isAuthenticated: JSON.parse(localStorage.getItem('isAuthenticated')) || false
  },
  mutations: {
    setEmail(state, email) {
      state.email = email
    },
    setAuthentication(state, status) {
      state.isAuthenticated = status
      // Save to localStorage for persistence across refresh
      localStorage.setItem('isAuthenticated', status)
    }
  },
  actions: {
    async login({ commit }, { apiUrl, payload }) {
      try {
        const response = await axios.post(apiUrl, payload, { withCredentials: true })
        if (response.data.success) {
          commit('setEmail', payload.email)
          commit('setAuthentication', true)

          // Redirect to home
          router.push('/')
        }else {
          router.push('/login')
        }
      } catch (error) {
        console.log('Login or register failed! Pls try again!', error)
      }
    },
    async logout({ commit }) {
      // Perform logout logic (e.g., API call)
      try {
        await axios.post('http://localhost:3000/api/auth/logout', {}, { withCredentials: true })
        // After successful logout, reset authentication state
        commit('setAuthentication', false)
        // Clear localStorage
        localStorage.removeItem('isAuthenticated')

        router.push('/')
      } catch (error) {
        console.error('Logout failed:', error)
      }
    },
    async checkAuth({ commit }) {
      const response = await axios.get('http://localhost:3000/api/auth/check-auth', { withCredentials: true })
      if (response.data.isAuthenticated) {

        commit('setAuthentication', true) // Restore state from localStorage
      } else {
        commit('setAuthentication', false) // Reset state if not authenticated
      }
    }
  },
  getters: {
    getEmail(state) {
      return state.email
    },
    isAuthenticated(state) {
      return state.isAuthenticated
    }
  }
}
