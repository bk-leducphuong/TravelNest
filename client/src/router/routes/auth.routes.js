// src/router/routes/auth.routes.js
import Login from '@/views/Login.vue'
import AdminLogin from '@/views/admin/AdminLogin.vue'

export default [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: AdminLogin
  }
]