// store/user.js
import axios from 'axios'
import i18n from '@/config/i18n'

export default {
  namespaced: true,
  state: {
    userInformation: null,
    userLocation: null,
    userLanguage: null, // vi-VN
  },
  mutations: {
    setUserLocation(state, location) {
      state.userLocation = location
    },
    setUserInformation(state, userInformation) {
      state.userInformation = userInformation
    },
    setUserLanguage(state, language) {
      state.userLanguage = language
    }
  },
  actions: {
    updateUserLocation({ commit }, location) {
      commit('setUserLocation', location)
    },
    updateUserLanguage({ commit }, language) {
      commit('setUserLanguage', language)
    },
    async retrieveUserInformation({ commit }) {
      try {
        const response = await axios.get('http://localhost:3000/api/user/get-user-information', {
          withCredentials: true
        })
        if (response.data.success) {
          commit('setUserInformation', response.data.user)
        }
      } catch (error) {
        console.error('Login failed! Pls try again!', error.response.data.message)
        this.toast.error('Login failed! Pls try again!')
      }
    }
  },
  getters: {
    getUserLocation(state) {
      return state.userLocation
    },
    getUserInformation(state) {
      return state.userInformation
    },
    getUserLanguage(state) {
      return state.userLanguage
    }
  }
}
