// src/router/routes/review.routes.js
import Reviews from '@/views/Reviews.vue'
import ReviewDetails from '@/views/ReviewDetails.vue'

export default [
  {
    path: '/reviews',
    name: 'Reviews',
    component: Reviews,
    meta: { requiresAuth: true }
  },
  {
    path: '/reviews/review-details',
    name: 'ReviewDetails',
    component: ReviewDetails,
    props: (route) => ({
      bc: route.query.bc, // booking code
      hid: route.query.hid, // hotel id
      hn: route.query.hn // hotel name
    }),
    meta: { requiresAuth: true }
  }
]
