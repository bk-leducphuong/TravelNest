// src/router/routes/notfound.routes.js
export default [
  // Catch-all route (for 404s)
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue') // Lazy load the NotFound view
  }
]
