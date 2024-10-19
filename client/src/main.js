import './assets/main.css'

import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import store from './stores'; // Import your store

import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import vi from './locales/vi.json';

// Define the translations and set the default language
const messages = {
  en: en,
  vi: vi
};
// Create an instance of vue-i18n
const i18n = createI18n({
  locale: 'en', // Default language
  fallbackLocale: 'en', // Fallback language in case of missing translations
  messages // Translation messages
});

const app = createApp(App)

// Add i18n to the app instance
app.use(i18n);
app.use(store);
app.use(router);

app.mount('#app')
