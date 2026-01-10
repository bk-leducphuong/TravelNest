export default {
  getUserLocation(state) {
    return state.userLocation
  },
  getUserInformation(state) {
    return state.userInformation
  },
  getUserLanguage(state) {
    return state.userLanguage || 'en-US'
  }
}
