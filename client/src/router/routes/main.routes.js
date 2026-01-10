// src/router/routes/main.routes.js
import HomeView from '@/views/HomeView.vue'
import HotelDetails from '@/views/HotelDetails.vue'
import SearchResults from '@/views/SearchResults.vue'

export default [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/hotels/:hotel_id',
    name: 'HotelDetails',
    component: HotelDetails
  },
  {
    path: '/search',
    name: 'SearchResults',
    component: SearchResults,
    props: (route) => ({
      location: route.query.location,
      checkInDate: route.query.checkInDate,
      checkOutDate: route.query.checkOutDate,
      adults: route.query.adults,
      children: route.query.children,
      rooms: route.query.rooms
    })
  }
]
