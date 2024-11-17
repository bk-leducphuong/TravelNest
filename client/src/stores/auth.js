// store/auth.js
import axios from 'axios'
import router from '@/router/index'

export default {
  namespaced: true,
  state: {
    email: '',
    role: '',
    isAuthenticated: false,
    otp: '',
    otpVerified: false
  },
  mutations: {
    setEmail(state, email) {
      state.email = email
    },
    setAuthentication(state, status) {
      state.isAuthenticated = status
    },
    setUserRole(state, role) {
      state.role = role
    },
    setOtp(state, otp) {
      state.otp = otp
    },
    setOtpVerified(state, status) {
      // for OTP verification
      state.otpVerified = status
    }
  },
  actions: {
    async login({ commit }, { apiUrl, payload, redirectRoute }) {
      try {
        const response = await axios.post(apiUrl, payload, { withCredentials: true })
        if (response.data.success) {
          commit('setEmail', payload.email)
          commit('setAuthentication', true)
          commit('setUserRole', payload.userRole)
          // Check for redirect query and navigate accordingly
          router.push(redirectRoute)
        }
      } catch (error) {
        this.toast.error('Login or register failed! Pls try again!')
        router.push('/login')
      }
    },
    async loginAdmin({ commit }, { apiUrl, payload }) {
      try {
        const response = await axios.post(apiUrl, payload, { withCredentials: true })
        if (response.data.success) {
          commit('setEmail', payload.email)
          commit('setAuthentication', true)
          commit('setUserRole', payload.userRole)

          // Check for redirect query and navigate accordingly
          router.push('/admin/home')
        }
      } catch (error) {
        console.log('Login or register failed! Pls try again!', error.response.data.message)
        this.toast.error('Login or register failed! Pls try again!')
      }
    },
    async logout({ commit }, { haveRedirect }) {
      // Perform logout logic (e.g., API call)
      try {
        await axios.post('http://localhost:3000/api/auth/logout', {}, { withCredentials: true })
        // After successful logout, reset authentication state
        commit('setAuthentication', false)
        // Clear localStorage
        localStorage.removeItem('isAuthenticated')

        if (haveRedirect) {
          router.push('/')
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
        commit('setAuthentication', true) // Restore state from localStorage
        if (response.data.userRole === 'customer') {
          commit('setUserRole', response.data.userRole)
        } else if (response.data.userRole === 'partner') {
          commit('setUserRole', response.data.userRole)
        }
      } else {
        commit('setAuthentication', false) // Reset state if not authenticated
      }
    },
    async sendOtp({ commit }, { phoneNumber }) {
      try {
        const response = await axios.post('http://localhost:3000/api/auth/send-otp', {
          phoneNumber: phoneNumber
        })
        if (response.data.success) {
          commit('setOtp', response.data.otp)
        } else {
          console.log('OTP not sent!')
        }
      } catch (error) {
        console.error('Error during OTP sending:', error)
      }
    },
    async verifyOtp({ commit }, { phoneNumber, otp }) {
      try {
        const response = await axios.post('http://localhost:3000/api/auth/verify-otp', {
          phoneNumber: phoneNumber,
          otp: otp
        })
        if (response.data.success) {
          commit('setOtpVerified', true)
        } else {
          commit('setOtpVerified', false)
        }
      } catch (error) {
        console.error('Error during OTP verification:', error)
      }
    }
  },
  getters: {
    getEmail(state) {
      return state.email
    },
    isAuthenticated(state) {
      return state.isAuthenticated
    },

    getUserRole(state) {
      return state.role
    },
    getOtp(state) {
      return state.otp
    },
    isOtpVerified(state) {
      return state.otpVerified
    }
  }
}
