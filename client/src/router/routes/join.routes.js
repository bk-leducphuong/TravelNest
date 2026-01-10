// src/router/routes/join.routes.js
import Join from '@/views/JoinHome.vue'
import JoinForm from '@/views/JoinForms.vue'

export default [
  {
    path: '/join',
    name: 'Join',
    component: Join
  },
  {
    path: '/join/become-a-host',
    name: 'JoinForm',
    component: JoinForm
  }
]
