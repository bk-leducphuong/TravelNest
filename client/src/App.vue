<script>
import { RouterLink, RouterView } from 'vue-router'
import { mapActions } from 'vuex';
import CookieConsent from './components/CookieConsent.vue';

export default {
  name: 'App',
  components: {
    CookieConsent
  },
  data() {
    return {
      hotels: [],
      userLocation: null,
      userLanguage: navigator.language || navigator.userLanguage
    };
  },
  methods: {
     ...mapActions('user', ['updateUserLocation']), // Access the user module action

    handleConsent(accepted) {
      if (accepted) {
        // User accepted cookies, you can initialize tracking here
        this.initializeTracking()
      } else {
        // User rejected cookies, respect their choice
        this.disableTracking()
      }
    },
    initializeTracking() {
      // Initialize your tracking scripts, analytics, etc.
      console.log('Tracking initialized')
    },
    disableTracking() {
      // Disable or remove tracking scripts
      console.log('Tracking disabled')
    },
    getUserLocation() {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          position => {
            this.userLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            };
            this.updateUserLocation(this.userLocation); // Dispatch the action to update user location
          },
          error => {
            console.error("Error getting user location:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    },
    updateLanguage() {
      if (this.userLanguage != 'en-US' && this.userLanguage != 'vi-VN') {
        this.$i18n.locale = 'en-US';
      } else {
        this.$i18n.locale = this.userLanguage;
      }
      localStorage.setItem('language', this.$i18n.locale); // Save language to localStorage
    }
  },
  mounted() {
    this.updateLanguage();
    this.getUserLocation();
  }
};
</script>

<template>
  <cookie-consent @consent-given="handleConsent" />
  <RouterView />
</template>

<style scoped>
</style>
