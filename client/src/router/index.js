// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
// import Register from '@/views/Register.vue';
// import Profile from '@/views/Profile.vue';
// import HotelList from '@/views/HotelList.vue';
import HotelDetails from '@/views/HotelDetails.vue'
// import RoomDetails from '@/views/RoomDetails.vue';
// import Bookings from '@/views/Bookings.vue';
// import BookingDetails from '@/views/BookingDetails.vue';
// import Payment from '@/views/Payment.vue';
import HomeView from '@/views/HomeView.vue'
import Join from '@/views/Join.vue'
import SearchResults from '@/views/SearchResults.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/join',
      name: 'join',
      component: Join
    },
    // hotel routes
    {
      path: '/hotel/:id',
      name: 'hotel details',
      component: HotelDetails
    },
    {
      path: '/search',
      name: 'SearchResults',
      component: SearchResults,
      props: (route) => ({
        location: route.query.location,
        dateRange: route.query.dateRange,
        adults: route.query.adults,
        children: route.query.children,
        rooms: route.query.rooms
      })
    },
    // Catch-all route (for 404s)
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFound.vue') // Lazy load the NotFound view
    }
  ]
})

// const routes = [
//   // Auth Routes
//   {
//     path: '/login',
//     name: 'Login',
//     component: Login
//   },

//   // {
//   //   path: '/register',
//   //   name: 'Register',
//   //   component: Register
//   // },

//   // // User Profile
//   // {
//   //   path: '/profile',
//   //   name: 'Profile',
//   //   component: Profile
//   // },

//   // // Hotels
//   // {
//   //   path: '/hotels',
//   //   name: 'HotelList',
//   //   component: HotelList
//   // },
//   // {
//   //   path: '/hotels/:id',
//   //   name: 'HotelDetails',
//   //   component: HotelDetails,
//   //   props: true
//   // },

//   // // Rooms
//   // {
//   //   path: '/hotels/:hotelId/rooms',
//   //   name: 'RoomList',
//   //   // component: RoomList, // If you're adding a separate list of rooms for each hotel
//   // },
//   // {
//   //   path: '/rooms/:roomId',
//   //   name: 'RoomDetails',
//   //   component: RoomDetails,
//   //   props: true
//   // },

//   // // Bookings
//   // {
//   //   path: '/bookings',
//   //   name: 'Bookings',
//   //   component: Bookings
//   // },
//   // {
//   //   path: '/bookings/:id',
//   //   name: 'BookingDetails',
//   //   component: BookingDetails,
//   //   props: true
//   // },

//   // // Payment
//   // {
//   //   path: '/payments/:bookingId',
//   //   name: 'Payment',
//   //   component: Payment,
//   //   props: true
//   // },

//   // // Home
//   // {
//   //   path: '/',
//   //   name: 'Home',
//   //   component: Home
//   // },

//   // // Catch-all route (for 404s)
//   // {
//   //   path: '/:pathMatch(.*)*',
//   //   name: 'NotFound',
//   //   component: () => import('@/views/NotFound.vue'), // Lazy load the NotFound view
//   // }
// ];

// const router = createRouter({
//   history: createWebHistory(process.env.BASE_URL),
//   routes
// });

export default router
