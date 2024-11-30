export default {
    namespaced: true,
    state: {
        bookingInformation: null
    },
    mutations: {
        setBookingInformation(state, bookingInformation) {
            state.bookingInformation = bookingInformation
        }
    },
    actions: {
        setBookingInformation({ commit }, bookingInformation) {
            commit('setBookingInformation', bookingInformation)
        }
    },
    getters: {
        getBookingInformation(state) {
            return state.bookingInformation
        }
    }
}