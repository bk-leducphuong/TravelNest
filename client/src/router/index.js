// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import HotelDetails from '@/views/HotelDetails.vue'
import HomeView from '@/views/HomeView.vue'
import Join from '@/views/JoinHome.vue'
import JoinForm from '@/views/JoinForms.vue'
import SearchResults from '@/views/SearchResults.vue'
import Book from '@/views/Book.vue'

import stores from '@/stores'
import Complete from '@/components/book/Complete.vue'
import AdminLogin from '@/views/admin/AdminLogin.vue'
import AdminHome from '@/views/admin/AdminHome.vue'
import AccountSettings from '@/views/account-settings/AccountSettings.vue'
import SettingDetails from '@/views/account-settings/SettingDetails.vue'
import AdminPayment from '@/views/admin/AdminPayment.vue'
import Return from '@/views/admin/Return.vue'
import Refresh from '@/views/admin/Refresh.vue'

const routes = [
  // route for customer
  {
    path: '/',
    name: 'Home',
    component: HomeView
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
  {
    path: '/join/become-a-host',
    name: 'JoinForm',
    component: JoinForm
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
      dateRange: route.query.dateRange,
      adults: route.query.adults,
      children: route.query.children,
      rooms: route.query.rooms
    })
  },
  {
    path: '/book',
    name: 'Book',
    component: Book,
    meta: { requiresAuth: true }
  },
  {
    path: '/book/complete',
    name: 'Complete',
    component: Complete,
    meta: { requiresAuth: true }
  },
  {
    path: '/account-settings',
    name: 'AccountSettings',
    component: AccountSettings,
    meta: { requiresAuth: true }
  },
  {
    path: '/account-settings/:details',
    name: 'SettingDetails',
    component: SettingDetails,
    meta: { requiresAuth: true }
  },
  // route for partner/admin
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: AdminLogin
  },
  {
    path: '/admin/home',
    name: 'AdminHome',
    component: AdminHome,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/payment',
    name: 'AdminPayment',
    component: AdminPayment,
    meta: { requiresAuth: true }
  },
  {
    path: '/refresh/:connectedAccountId',
    name: 'Refresh',
    component: Refresh
  },
  {
    path: '/return/:connectedAccountId',
    name: 'Return',
    component: Return
  },
  // Catch-all route (for 404s)
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue') // Lazy load the NotFound view
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation guard to check authentication before entering protected routes
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (to.path.indexOf('admin') != -1) {
      // if admin
      if (!stores.getters['auth/isAdminAuthenticated']) {
        next({ name: 'AdminLogin', query: { redirect: to.fullPath } }) // Redirect to login if not authenticated
      }else {
        next()
      }
    } else {
      // if user
      if (!stores.getters['auth/isUserAuthenticated']) {
        next({ name: 'Login', query: { redirect: to.fullPath } }) // Redirect to login if not authenticated
      }else {
        next()
      }
    }
  } else {
    next() // Always allow non-protected routes
  }
})

export default router
