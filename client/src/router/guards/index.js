// src/router/guards/index.js
import stores from '@/stores/index.js'
import { checkAuthGuard } from './auth.guard'
import { checkAdminAuthGuard } from './admin.guard'

export function setupGuards(router) {
  router.beforeEach((to, from, next) => {
    stores.dispatch('auth/checkAuth').then(() => {
      if (to.path.startsWith('/admin/')) {
        checkAdminAuthGuard(to, from, next)
      } else {
        checkAuthGuard(to, from, next)
      }
    })
  })
}
