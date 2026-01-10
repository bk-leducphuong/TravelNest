// src/router/routes/stripe.routes.js
import Refresh from '@/views/admin/Refresh.vue'
import Return from '@/views/admin/Return.vue'

export default [
  {
    path: '/refresh/:connectedAccountId',
    name: 'Refresh',
    component: Refresh
  },
  {
    path: '/return/:connectedAccountId',
    name: 'Return',
    component: Return
  }
]
