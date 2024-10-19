<script>
import TheHeader from '../components/Header.vue'
import axios from 'axios';
import { mapState } from 'vuex';

export default {
  components: {
    TheHeader
  },
  data() {
    return {
      hotels: null
    };
  },
  computed: {
    ...mapState('user', ['userLocation']), // Map userLocation from the user module
  },
  methods: {
    async fetchNearbyHotels() {
      try {
        const response = await axios.post('/api/home/nearby-hotels', {
          location: this.userLocation
        });
        this.hotels = response.data;

        
      } catch (error) {
        console.error("Error fetching nearby hotels:", error);

      }
    }
  },
  mounted() {
    this.fetchNearbyHotels();
  }
}
</script>

<template>
  <TheHeader/>
</template>
