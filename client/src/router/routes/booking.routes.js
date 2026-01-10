// src/router/routes/booking.routes.js
import Book from '@/views/Book.vue'
import BookingConfirmation from '@/views/BookingConfirmation.vue'
import Bookings from '@/views/Bookings.vue'
import BookingDetails from '@/views/BookingDetails.vue'
import BookingCancellation from '@/views/BookingCancellation.vue'

export default [
  {
    path: '/book',
    name: 'Book',
    component: Book,
    meta: { requiresAuth: true }
  },
  {
    path: '/book/complete',
    name: 'BookingConfirmation',
    component: BookingConfirmation,
    props: (route) => ({
      bookingCode: route.query.bookingCode
    }),
    meta: { requiresAuth: true }
  },
  {
    path: '/bookings',
    name: 'Bookings',
    component: Bookings,
    meta: { requiresAuth: true }
  },
  {
    path: '/bookings/:bookingCode',
    name: 'BookingDetails',
    component: BookingDetails,
    meta: { requiresAuth: true }
  },
  {
    path: '/bookings/:bookingCode/cancel',
    name: 'BookingCancellation',
    component: BookingCancellation,
    meta: { requiresAuth: true }
  }
]
