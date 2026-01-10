// src/router/routes/admin.routes.js
import HotelsManagement from '@/views/admin/HotelsManagement.vue'
import AdminHome from '@/views/admin/AdminHome.vue'
import AdminPayment from '@/views/admin/payment/AdminPayment.vue'
import InvoiceList from '@/views/admin/payment/InvoiceList.vue'
import InvoiceDetails from '@/views/admin/payment/InvoiceDetails.vue'
import StripeManagement from '@/views/admin/payment/StripeManagement.vue'
import AllBookings from '@/views/admin/bookings/AllBookings.vue'
import AdminBookingDetails from '@/views/admin/bookings/BookingDetails.vue'
import AvailabilityCalendar from '@/views/admin/room-availability/AvailabilityCalendar.vue'
import RoomDetails from '@/views/admin/room/RoomDetails.vue'
import RoomPhotos from '@/views/admin/room/RoomPhotos.vue'
import RoomAmenities from '@/views/admin/room/RoomAmenities.vue'
import GuestReviews from '@/views/admin/review/GuestReviews.vue'

export default [
  {
    path: '/admin/hotels-management',
    name: 'HotelsManagement',
    component: HotelsManagement,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/:hotelId/home',
    name: 'AdminHome',
    component: AdminHome,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/:hotelId/payment',
    name: 'AdminPayment',
    component: AdminPayment,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/:hotelId/payment/invoices',
    name: 'InvoiceList',
    component: InvoiceList,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/:hotelId/payment/invoice-details',
    name: 'InvoiceDetails',
    component: InvoiceDetails,
    props: (route) => ({
      invoiceId: route.query.invoiceId
    }),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/:hotelId/payment/stripe-connect-account-management',
    name: 'StripeManagement',
    component: StripeManagement,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/:hotelId/bookings/all',
    name: 'AllBookings',
    component: AllBookings,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/:hotelId/bookings/booking-details',
    name: 'AdminBookingDetails',
    component: AdminBookingDetails,
    props: (route) => ({
      bc: route.query.bc // booking code
    }),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/:hotelId/room-availability/availability-calendar',
    name: 'AvailabilityCalendar',
    component: AvailabilityCalendar,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/:hotelId/room/room-details',
    name: 'RoomDetails',
    component: RoomDetails,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/:hotelId/room/room-photos',
    name: 'RoomPhotos',
    component: RoomPhotos,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/:hotelId/room/room-amenities',
    name: 'RoomAmenities',
    component: RoomAmenities,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/:hotelId/review/guest-reviews',
    name: 'GuestReviews',
    component: GuestReviews,
    meta: { requiresAuth: true }
  }
]
