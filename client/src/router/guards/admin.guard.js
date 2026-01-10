// src/router/guards/admin.guard.js
import stores from '@/stores/index.js'

export const checkAdminAuthGuard = async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!stores.getters['auth/isAdminAuthenticated']) {
      next({ name: 'AdminLogin', query: { redirect: to.fullPath } }) // Redirect to login if not authenticated
    } else {
      // get all managing hotels
      if (stores.getters['manageHotels/getManagingHotels'].length == 0) {
        await stores.dispatch('manageHotels/getAllManagingHotels')
      }
      if (to.params.hotelId) {
        // validate hotel
        const isValidHotelId = await stores.dispatch('manageHotels/validateHotel', {
          hotelId: to.params.hotelId
        })
        if (!isValidHotelId) {
          next({ name: 'HotelsManagement' }) // Redirect to hotel management dashboard if hotel id is invalid
        } else {
          stores.commit('manageHotels/setCurrentManagingHotelInformation', to.params.hotelId)
          next()
        }
      } else {
        next()
      }
    }
  } else {
    next()
  }
}
