import axios from 'axios'
export default {
    namespaced: true,
    state: {
        currentManagingHotelId: null,
        managingHotels: []
    },
    mutations: {
        setManagingHotels(state, managingHotels) {
            state.managingHotels = managingHotels
        },
        setCurrentManagingHotelId(state, currentManagingHotelId) {
            state.currentManagingHotelId = currentManagingHotelId   
        }
    },
    actions: {
        async getAllManagingHotels({ commit }) {
            const response = await axios.get('http://localhost:3000/api/admin/hotels-management', {
                withCredentials: true
            })
            commit('setManagingHotels', response.data.managingHotels)
        },
        async selectHotelToManage({ commit }, hotelId) {
            commit('setCurrentManagingHotelId', hotelId)        
        },
        validateHotel({ commit, state }, {hotelId}) {
            for (const hotel of state.managingHotels) {
                console.log(hotel.hotel_id)
                if (hotel.hotel_id == hotelId) {
                    commit('setCurrentManagingHotelId', hotelId)
                    return true
                }
            }
            return false
        }
    },
    getters: {
        getManagingHotels(state) {
            return state.managingHotels
        }
    }
}