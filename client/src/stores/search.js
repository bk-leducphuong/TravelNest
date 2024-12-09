import axios from 'axios'

export default {
  namespaced: true,
  state: {
    searchData: {
      location: '',
      checkInDate: null,
      checkOutDate: null,
      numberOfDays: 1,
      adults: 2,
      children: 0,
      rooms: 1
    }
  },
  mutations: {
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
  },
  actions: {
    updateLocation({ commit }, location) {
      commit('setLocation', location)
    },
    updateCheckInDate({ commit }, checkInDate) {
      commit('setCheckInDate', checkInDate)
    },
    updateCheckOutDate({ commit }, checkOutDate) {
      commit('setCheckOutDate', checkOutDate)
    },
    updateNumberOfDays({ commit }, numberOfDays) {
      commit('setNumberOfDays', numberOfDays)
    },
    updateAdults({ commit }, adults) {
      commit('setAdults', adults)
    },
    updateChildren({ commit }, children) {
      commit('setChildren', children)
    },
    updateRooms({ commit }, rooms) {
      commit('setRooms', rooms)
    },
    async saveSearchInformation({ commit, state }) {
      try {
         const searchData = {
          location: state.searchData.location,
          checkInDate: state.searchData.checkInDate,
          checkOutDate: state.searchData.checkOutDate,
          adults: state.searchData.adults,
          children: state.searchData.children,
          rooms: state.searchData.rooms,
          numberOfDays: state.searchData.numberOfDays
        }
        // save search information to database
        await axios.post(
          'http://localhost:3000/api/search/save-search-information',
          {
           searchData: searchData
          },
          {
            withCredentials: true
          }
        )
        // save search information to localStorage
        let searchHistory = JSON.parse(localStorage.getItem('recentSearches')) || []
        if (searchHistory.length > 10) {
          searchHistory.shift()
        }
        searchHistory.push(searchData)
        searchHistory.reverse()
        localStorage.setItem('recentSearches', JSON.stringify(searchHistory))
      } catch (error) {
        console.error(error)
      }
    }
  },
  getters: {
    getSearchData(state) {
      return state.searchData
    }
  }
}
