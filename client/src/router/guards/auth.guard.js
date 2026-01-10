// src/router/guards/auth.guard.js
import stores from '@/stores/index.js'

export const checkAuthGuard = (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!stores.getters['auth/isUserAuthenticated']) {
      next({ name: 'Login', query: { redirect: to.fullPath } }) // Redirect to login if not authenticated
    } else {
      next()
    }
  } else {
    next()
  }
}
