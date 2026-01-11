<script>
import TheHeader from '../components/Header.vue'
import TheFooter from '../components/Footer.vue'
import NewUserPopup from '@/components/NewUserPopup.vue'
import RecentSearchs from '@/components/home/RecentSearchs.vue'
import ViewedHotels from '@/components/home/ViewedHotels.vue'
import NearbyHotels from '@/components/home/NearbyHotels.vue'
import PopularPlaces from '@/components/home/PopularPlaces.vue'
import { mapGetters } from 'vuex'
import { HomeService } from '@/services/home.service'
import errorHandler from '@/request/errorHandler.js'

export default {
  components: {
    TheHeader,
    TheFooter,
    NewUserPopup,
    RecentSearchs,
    ViewedHotels,
    NearbyHotels,
    PopularPlaces
  },
  data() {
    return {
      recentSearches: [],
      viewedHotels: [],
      popularPlaces: [],
      isPopularPlacesLoading: false,
      isNewUserPopupOpen: false
    }
  },
  computed: {
    ...mapGetters('user', ['getUserLocation']),
    ...mapGetters('auth', ['isUserAuthenticated'])
  },
  methods: {
    async loadRecentSearches() {
      if (this.isUserAuthenticated) {
        try {
          const response = await HomeService.getRecentSearches()
          const data = response.data || response
          this.recentSearches = data || []
        } catch (error) {
          errorHandler(error)
        }
      } else {
        this.recentSearches = localStorage.getItem('recentSearches')
          ? JSON.parse(localStorage.getItem('recentSearches'))
          : []
      }
    },
    async loadViewedHotels() {
      try {
        let response
        if (this.isUserAuthenticated) {
          // Authenticated: GET /api/home/recent-viewed-hotels (no params needed)
          response = await HomeService.getRecentViewedHotels()
        } else {
          // Non-authenticated: GET /api/home/recent-viewed-hotels?hotelIds=[1,2,3]
          const hotelIdArray = localStorage.getItem('viewedHotels')
            ? JSON.parse(localStorage.getItem('viewedHotels'))
            : []
          response = await HomeService.getRecentViewedHotels({ 
            hotelIds: JSON.stringify(hotelIdArray) 
          })
        }
        
        const data = response.data || response
        if (data.hotels && data.hotels.length > 0) {
          this.viewedHotels = data.hotels.reverse()
        }
      } catch (error) {
        errorHandler(error)
      }
    },
    async loadPopularPlaces() {
      try {
        this.isPopularPlacesLoading = true
        const response = await HomeService.getPopularPlaces()
        const data = response.data || response
        this.popularPlaces = data.popular_places || []
      } catch (error) {
        errorHandler(error)
      } finally {
        this.isPopularPlacesLoading = false
      }
    },
    handleRecentSearchesUpdate(updatedSearches) {
      this.recentSearches = updatedSearches
    }
  },
  mounted() {
    if (!this.isUserAuthenticated) {
      const isNewUser = localStorage.getItem('isNewUser')
      if (!isNewUser) {
        localStorage.setItem('isNewUser', 'true')
        this.isNewUserPopupOpen = true
      } else {
        localStorage.setItem('isNewUser', 'false')
      }
    } else {
      localStorage.setItem('isNewUser', 'false')
    }
    this.loadRecentSearches()
    this.loadViewedHotels()
    this.loadPopularPlaces()
  }
}
</script>

<template>
  <NewUserPopup v-if="isNewUserPopupOpen" @close="isNewUserPopupOpen = false" />
  <TheHeader :isSearchOpen="true" />
  <div class="home-container">
    <RecentSearchs
      :recent-searches="recentSearches"
      :is-user-authenticated="isUserAuthenticated"
      @update:recentSearches="handleRecentSearchesUpdate"
    />
    <ViewedHotels :viewed-hotels="viewedHotels" />
    <NearbyHotels :user-location="getUserLocation" />
    <PopularPlaces :popular-places="popularPlaces" :is-loading="isPopularPlacesLoading" />
  </div>
  <TheFooter />
</template>

<style lang="scss" scoped>
@import '@/assets/styles/index.scss';

.home-container {
  position: relative;
  clear: both;
  vertical-align: top;
  width: 100%;
  max-width: 1100px;
  margin: auto;
}

img {
  display: inline-block;
  border-radius: 12px;
}
</style>
