// src/router/routes/account.routes.js
import AccountSettings from '@/views/account-settings/AccountSettings.vue'
import SettingDetails from '@/views/account-settings/SettingDetails.vue'
import SavedHotels from '@/views/SavedHotels.vue'

export default [
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
  {
    path: '/saved-hotels',
    name: 'SavedHotels',
    component: SavedHotels,
    meta: { requiresAuth: true }
  }
]
