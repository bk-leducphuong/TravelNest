export default {
  setLocation(state, location) {
    state.searchData.location = location
  },
  setCheckInDate(state, checkInDate) {
    state.searchData.checkInDate = checkInDate
  },
  setCheckOutDate(state, checkOutDate) {
    state.searchData.checkOutDate = checkOutDate
  },
  setNumberOfDays(state, numberOfDays) {
    state.searchData.numberOfDays = numberOfDays
  },
  setAdults(state, adults) {
    state.searchData.adults = adults
  },
  setChildren(state, children) {
    state.searchData.children = children
  },
  setRooms(state, rooms) {
    state.searchData.rooms = rooms
  }
}
