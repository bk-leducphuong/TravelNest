// store/user/actions.js
import { UserService } from '@/services/user.service'

export default {
  updateUserLocation({ commit }, location) {
    commit('setUserLocation', location)
  },
  updateUserLanguage({ commit }, language) {
    commit('setUserLanguage', language)
  },
  async retrieveUserInformation({ commit }) {
    try {
      const response = await UserService.getCurrentUser()
      if (response.data) {
        commit('setUserInformation', response.data)
      }
    } catch (error) {
      console.error('Failed to retrieve user information!', error)
    }
  }
}
