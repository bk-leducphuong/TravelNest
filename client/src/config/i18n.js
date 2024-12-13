
import { createI18n } from 'vue-i18n';
import en from '@/locales/en.json'
import vi from '@/locales/vi.json'

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

export default i18n;