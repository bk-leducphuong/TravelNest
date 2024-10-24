<script>
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
      userLanguage: navigator.language || navigator.userLanguage
    };
  },
  methods: {
    ...mapActions('user', ['updateUserLocation']), // Access the user module action

    handleConsent(accepted) {
      if (accepted) {
        // User accepted cookies, you can initialize tracking here
        this.initializeTracking();
      } else {
        // User rejected cookies, respect their choice
        this.disableTracking();
      }
    },
    initializeTracking() {
      // Initialize your tracking scripts, analytics, etc.
      console.log('Tracking initialized');
    },
    disableTracking() {
      // Disable or remove tracking scripts
      console.log('Tracking disabled');
    },
    getUserLocation() {
      if ("geolocation" in navigator) {
        return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            position => {
              const userLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              };
              resolve(userLocation);
            },
            error => {
              console.error("Error getting user location:", error);
              reject(error); // Important to reject on error
            }
          );
        });
      } else {
        console.error("Geolocation is not supported by this browser.");
        return Promise.reject("Geolocation not supported");
      }
    },
    updateLanguage() {
      if (this.userLanguage !== 'en-US' && this.userLanguage !== 'vi-VN') {
        this.$i18n.locale = 'en-US';
      } else {
        this.$i18n.locale = this.userLanguage;
      }
      localStorage.setItem('language', this.$i18n.locale); // Save language to localStorage
    }
  },
  mounted() {
    this.updateLanguage();

    // Fetch user location and update Vuex store
    this.getUserLocation()
      .then(location => {
        this.updateUserLocation(location); // Dispatch action to update user location
      })
      .catch(error => {
        console.error("Failed to get user location:", error);
        // You can handle the error here, e.g., show a default location
      });
  }
};
</script>

<template>
  <cookie-consent @consent-given="handleConsent" />
  <RouterView />
</template>

<style scoped></style>
