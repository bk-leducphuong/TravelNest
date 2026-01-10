export default {
  setManagingHotels(state, managingHotels) {
    state.managingHotels = managingHotels
  },
  setCurrentManagingHotelId(state, currentManagingHotelId) {
    state.currentManagingHotelId = currentManagingHotelId
  },
  setCurrentManagingHotelInformation(state, currentManagingHotelId) {
    for (const hotel of state.managingHotels) {
      if (hotel.hotel_id == currentManagingHotelId) {
        state.currentManagingHotelInformation = hotel
        return
      }
    }
  }
}
