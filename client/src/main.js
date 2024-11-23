import './assets/main.css'

import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import stores from './stores/index.js'  // import store

import { clickOutside } from '../directives/clickOutsite'; // import custom directives

import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import vi from './locales/vi.json';

import Toast from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";

import "leaflet"

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

// add custom directives
app.directive('click-outside', clickOutside);

// Add i18n to the app instance
app.use(i18n);
app.use(stores);
app.use(router);

// toast notification
const options = {
    //...
};

app.use(Toast, options);

app.mount('#app')
