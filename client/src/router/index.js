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

import stores from '@/stores'
import MapComponent from '@/components/map/MapComponent.vue'

const routes = [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
      //  meta: { requiresAuth: true } // Mark route as requiring authentication
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/join',
      name: 'Join',
      component: Join
    },
    // hotel routes
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
        dateRange: route.query.dateRange,
        adults: route.query.adults,
        children: route.query.children,
        rooms: route.query.rooms
      })
    },
    {
      path: '/map',
      name: 'Map',
      component: MapComponent,

    },
    // Catch-all route (for 404s)
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFound.vue') // Lazy load the NotFound view
    }
  ];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation guard to check authentication before entering protected routes
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!stores.getters['auth/isAuthenticated']) {
      next({ name: 'Login' }); // Redirect to login if not authenticated
    } else {
      next(); // Proceed if authenticated
    }
  } else {
    next(); // Always allow non-protected routes
  }
});

export default router
