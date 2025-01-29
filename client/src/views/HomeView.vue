<script>
import TheHeader from '../components/Header.vue'
import TheFooter from '../components/Footer.vue'
import SavedHotelIcon from '@/components/SavedHotelIcon.vue'
import NewUserPopup from '@/components/NewUserPopup.vue'
import axios from 'axios'
import { mapActions, mapState, mapGetters } from 'vuex'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'

export default {
  components: {
    TheHeader,
    TheFooter,
    Loading,
    SavedHotelIcon,
    NewUserPopup
  },
  data() {
    return {
      recentSearches: [], // Array to store recently searched data
      viewedHotels: [], // Array to store viewed hotels data
      nearbyHotels: [], // Example nearby hotels data
      popularPlaces: [], // Example popular places data

      sliderPosition: new Map([
        ['recentSlider', 0],
        ['viewedSlider', 0],
        ['nearbySlider', 0]
      ]),

      isNearByHotelsLoading: false,
      isPopularPlacesLoading: false,
      isRecentSearchesLoading: false,
      isViewedHotelsLoading: false,
      isNewUserPopupOpen: false
    }
  },
  computed: {
    ...mapGetters('user', ['getUserLocation']), // Map userLocation from the user module,
    ...mapGetters('auth', ['isUserAuthenticated']),
    // Check if left scroll should be disabled
    disableScrollLeft() {
      return (sliderRef) => this.sliderPosition.get(sliderRef) === 0
    },
    // Check if right scroll should be disabled
    disableScrollRight() {
      return (sliderRef) => {
        const slider = this.$refs[sliderRef]
        if (!slider) return true // Ensure the ref exists
        // Check if the slider is scrolled all the way to the right
        // console.log(sliderRef, this.sliderPosition.get(sliderRef), slider.scrollWidth, slider.clientWidth)
        return this.sliderPosition.get(sliderRef) >= slider.scrollWidth - slider.clientWidth
      }
    }
  },
  methods: {
    ...mapActions('search', [
      'updateLocation',
      'updateCheckInDate',
      'updateCheckOutDate',
      'updateAdults',
      'updateChildren',
      'updateRooms'
    ]),
    redirectToSearchResults(search) {
      // Redirect user to search results page with query params
      this.$router.push({
        name: 'SearchResults',
        query: {
          location: search.location,
          checkInDate: search.check_in_date.split('T')[0],
          checkOutDate: search.check_out_date.split('T')[0],
          adults: search.adults,
          children: search.children,
          rooms: search.rooms,
          numberOfDays: search.number_of_days
        }
      })
    },
    // redirect user to hotel details page
    async redirectToHotelDetails(hotel) {
      try {
        this.updateLocation(hotel.city)
        const hotel_id = hotel.hotel_id
        // save viewed hotel
        let viewedHotels = localStorage.getItem('viewedHotels')
          ? JSON.parse(localStorage.getItem('viewedHotels'))
          : []

        // Check if the hotel has already been viewed
        const index = viewedHotels.findIndex((hotelId) => hotelId === hotel_id)

        if (index !== -1) {
          // If already viewed, move the hotel to the end of the array (most recent)
          viewedHotels.splice(index, 1) // Remove existing entry
        }
        viewedHotels.push(hotel_id)
        localStorage.setItem('viewedHotels', JSON.stringify(viewedHotels))

        if (this.isUserAuthenticated) {
          await axios.post(
            `${import.meta.env.VITE_SERVER_HOST}/api/home/post-recent-viewed-hotels`,
            {
              hotelId: hotel_id
            },
            { withCredentials: true }
          )
        }

        this.$router.push({ name: 'HotelDetails', params: { hotel_id: hotel_id } })
      } catch (error) {
        console.error(error)
        console.log('Error saving viewed hotel')
      }
    },
    // load hotels which close to user
    async loadNearbyHotels() {
      try {
        this.isNearByHotelsLoading = true
        const response = await axios.post(`${import.meta.env.VITE_SERVER_HOST}/api/home/nearby-hotels`, {
          location: this.getUserLocation
        })
        this.nearbyHotels = response.data.hotels
        this.noNearbyHotelsFound = this.nearbyHotels.length === 0 ? true : false
      } catch (error) {
        console.error('Error fetching nearby hotels:', error)
      } finally {
        this.isNearByHotelsLoading = false
      }
    },
    // Load data from localStorage for recently searched
    async loadRecentSearches() {
      if (this.isUserAuthenticated) {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_HOST}/api/home/recent-searchs`, {
          withCredentials: true
        })
        this.recentSearches = response.data
      } else {
        this.recentSearches = localStorage.getItem('recentSearches')
          ? JSON.parse(localStorage.getItem('recentSearches'))
          : []
      }
    },

    // Load data from localStorage for viewed hotels
    async loadViewedHotels() {
      if (this.isUserAuthenticated) {
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_HOST}/api/home/get-recent-viewed-hotels`,
          {},
          {
            withCredentials: true
          }
        )

        this.viewedHotels = response.data.hotels.reverse()
      } else {
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_HOST}/api/home/get-recent-viewed-hotels`,
          {
            hotelIdArray: JSON.parse(localStorage.getItem('viewedHotels'))
          }
        )

        this.viewedHotels = response.data.hotels.reverse()
      }
    },

    // Static popular places data (replace with API or dynamic data)
    async loadPopularPlaces() {
      try {
        this.isPopularPlacesLoading = true
        const response = await axios.get(`${import.meta.env.VITE_SERVER_HOST}/api/home/popular-places`)

        this.popularPlaces = response.data.popular_places

        this.noPopularPlacesFound = this.popularPlaces.length === 0 ? true : false
        // console.log(this.popularPlaces);
      } catch (error) {
        console.error('Error fetching popular places:', error)
      } finally {
        this.isPopularPlacesLoading = false
      }
    },

    // Remove a recent search item
    async removeSearch(removedSearch, searchIndex) {
      try {
        event.stopPropagation() // Stop the event from bubbling up to the parent

        // remove from local storage
        this.recentSearches.splice(searchIndex, 1)
        localStorage.setItem('recentSearches', JSON.stringify(this.recentSearches))

        if (this.isUserAuthenticated) {
          // remove from database
          await axios.post(
            `${import.meta.env.VITE_SERVER_HOST}/api/home/remove-recent-search`,
            {
              search_id: removedSearch.search_id
            },
            {
              withCredentials: true
            }
          )
        }
      } catch (error) {
        console.error(error)
      }
    },

    // Toggle favorite status
    toggleFavorite(index) {
      const hotel = this.viewedHotels[index]
      hotel.isFavorite = !hotel.isFavorite
      this.viewedHotels.splice(index, 1, hotel)
      localStorage.setItem('viewedHotels', JSON.stringify(this.viewedHotels))
    },

    // Scroll functionality for sliders
    scrollLeft(sliderRef) {
      const slider = this.$refs[sliderRef]
      // Ensure the scroll position doesn't go below 0
      this.sliderPosition.set(sliderRef, Math.max(this.sliderPosition.get(sliderRef) - 300, 0))

      slider.scrollTo({ left: this.sliderPosition.get(sliderRef), behavior: 'smooth' })
    },

    scrollRight(sliderRef) {
      const slider = this.$refs[sliderRef]
      // Ensure the scroll position doesn't exceed the rightmost position
      this.sliderPosition.set(
        sliderRef,
        Math.min(this.sliderPosition.get(sliderRef) + 300, slider.scrollWidth - slider.clientWidth)
      )

      slider.scrollTo({ left: this.sliderPosition.get(sliderRef), behavior: 'smooth' })
    },
    handleScroll(event, sliderRef) {
      const slider = event.target
      this.sliderPosition.set(sliderRef, slider.scrollLeft)
    },
    calculateNumberOfDays(checkInDateString, checkOutDateString) {
      const checkInDate = new Date(checkInDateString)
      const checkOutDate = new Date(checkOutDateString)
      const timeDifference = checkOutDate - checkInDate
      return timeDifference / (1000 * 60 * 60 * 24) + 1
    },
    serverHost() {
      return import.meta.env.VITE_SERVER_HOST
    }
  },
  watch: {
    getUserLocation: {
      handler(newLocation) {
        if (newLocation) {
          this.loadNearbyHotels() // Call loadNearbyHotels when userLocation is updated
        }
      },
      immediate: true // Ensures the watcher runs immediately when the component is created
    },
  },
  mounted() {
    if (!this.isUserAuthenticated) {
      const isNewUser = localStorage.getItem('isNewUser')
      if (!isNewUser) {
        localStorage.setItem('isNewUser', 'true')
        this.isNewUserPopupOpen = true
      }else {
        localStorage.setItem('isNewUser', 'false')
      }
    }else {
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
  <!-- home body -->
  <div class="home-container">
    <!-- Recently Search -->
    <div class="recent-search-container container" v-if="recentSearches.length > 0">
      <h2 class="h2">{{ $t('userHome.recentSearches') }}</h2>
      <div class="slider-container">
        <div
          ref="recentSlider"
          class="search-slider"
          @scroll="(event) => handleScroll(event, 'recentSlider')"
        >
          <div
            class="search-card"
            v-for="(search, index) in recentSearches"
            :key="index"
            @click="redirectToSearchResults(search)"
          >
            <div class="search-image">
              <img
                :src="serverHost() + '/vietnam_city/' + search.location + '.jpg'"
                :alt="search.location"
              />
            </div>
            <div class="search-content">
              <h2 class="search-title">{{ search.location }}</h2>
              <p class="search-details">
                From {{ new Date(search.check_in_date).toLocaleDateString('vi-VN') }} to
                {{ new Date(search.check_out_date).toLocaleDateString('vi-VN') }}
              </p>
            </div>
            <button class="close-button" @click="removeSearch(search, searchIndex)">×</button>
          </div>
        </div>
        <div class="nav-button-container" v-if="recentSearches.length > 0">
          <button
            class="nav-button prev"
            :disabled="disableScrollLeft('recentSlider')"
            @click="scrollLeft('recentSlider')"
          >
            ‹
          </button>
          <button
            class="nav-button next"
            :disabled="disableScrollRight('recentSlider')"
            @click="scrollRight('recentSlider')"
          >
            ›
          </button>
        </div>
      </div>
    </div>

    <!-- Viewed Hotels -->
    <div class="hotel-container container" v-if="viewedHotels.length > 0">
      <h2 class="h2">{{ $t('userHome.viewedHotels') }}</h2>
      <div class="slider-container">
        <div
          ref="viewedSlider"
          class="hotel-slider"
          @scroll="(event) => handleScroll(event, 'viewedSlider')"
        >
          <div
            class="hotel-card"
            v-for="(hotel, index) in viewedHotels"
            :key="index"
            @click="redirectToHotelDetails(hotel)"
          >
            <div class="hotel-image">
              <img v-if="hotel.image_urls" :src="JSON.parse(hotel.image_urls)[0]" :alt="hotel.name"/>
              <img :src="serverHost() + '/uploads/hotels/no-image.png'" alt="hotel image" v-else />
              <SavedHotelIcon :hotelId="hotel.hotel_id" />
            </div>
            <div class="hotel-content">
              <h2 class="hotel-name">{{ hotel.name }}</h2>
              <p class="hotel-location">{{ hotel.address.slice(0, 35) }} ...</p>
              <div class="hotel-rating">
                <span class="rating-badge">{{ hotel.overall_rating }}</span>
                <span class="rating-text">{{ hotel.reviewSummary }}</span>
                <span class="review-count">{{ hotel.reviewCount }}điểm đánh giá</span>
              </div>
            </div>
          </div>
        </div>
        <div class="nav-button-container" v-if="viewedHotels.length > 0">
          <button
            class="nav-button prev"
            :disabled="disableScrollLeft('viewedSlider')"
            @click="scrollLeft('viewedSlider')"
          >
            ‹
          </button>
          <button
            class="nav-button next"
            :disabled="disableScrollRight('viewedSlider')"
            @click="scrollRight('viewedSlider')"
          >
            ›
          </button>
        </div>
      </div>
    </div>

    <!-- Nearby Hotels -->
    <div class="hotel-container container" v-if="nearbyHotels.length > 0">
      <h2 class="h2">{{ $t('userHome.nearbyHotels') }}</h2>
      <loading
        v-model:active="isNearByHotelsLoading"
        :can-cancel="true"
        :color="`#003b95`"
        :is-full-page="false"
      />
      <div class="slider-container">
        <div
          ref="nearbySlider"
          class="hotel-slider"
          @scroll="(event) => handleScroll(event, 'nearbySlider')"
        >
          <div
            class="hotel-card"
            v-for="(hotel, index) in nearbyHotels"
            :key="index"
            @click="redirectToHotelDetails(hotel)"
          >
            <div class="hotel-image">
              <img v-if="hotel.image_urls" :src="JSON.parse(hotel.image_urls)[0]" :alt="hotel.name" />
              <img v-else :src="serverHost() + '/uploads/hotels/no-image.png'" :alt="hotel.name" />
              <SavedHotelIcon :hotelId="hotel.hotel_id" />
            </div>
            <div class="hotel-content">
              <h2 class="hotel-name">{{ hotel.name }}</h2>
              <p class="hotel-location">{{ hotel.address.slice(0, 35) }} ...</p>
              <div class="hotel-rating">
                <span class="rating-badge">{{ hotel.overall_rating }}</span>
                <span class="rating-text">{{ hotel.reviewSummary }}</span>
                <span class="review-count">{{ hotel.reviewCount }}điểm đánh giá</span>
              </div>
            </div>
          </div>
        </div>
        <div class="nav-button-container" v-if="nearbyHotels.length > 0">
          <button
            class="nav-button prev"
            :disabled="disableScrollLeft('nearbySlider')"
            @click="scrollLeft('nearbySlider')"
          >
            ‹
          </button>
          <button
            class="nav-button next"
            :disabled="disableScrollRight('nearbySlider')"
            @click="scrollRight('nearbySlider')"
          >
            ›
          </button>
        </div>
      </div>
    </div>

    <!-- Popular Places -->
    <div class="popular-container container" v-if="popularPlaces.length > 0">
      <div class="popular-header">
        <h2 class="h2">{{ $t('userHome.popularPlaces') }}</h2>
        <h4 class="h4">{{ $t('userHome.popularPlaces_1') }}</h4>
      </div>
      <loading
        v-model:active="isPopularPlacesLoading"
        :can-cancel="true"
        :color="`#003b95`"
        :is-full-page="false"
      />
      <div class="popular-place-card-up-grid popular-place-card-grid">
        <div
          class="popular-place-card"
          v-for="(place, index) in popularPlaces.slice(0, 2)"
          :key="index"
          @click="
            redirectToSearchResults({
              location: place.location,
              checkInDate: '',
              checkOutDate: '',
              adults: '',
              children: '',
              rooms: ''
            })
          "
        >
          <img
            :src="serverHost() + '/vietnam_city/' + place.location + '.jpg'"
            :alt="place.location"
          />
        </div>
      </div>
      <div
        class="popular-place-card-bottom-grid popular-place-card-grid"
        v-if="popularPlaces.length > 2"
      >
        <div
          class="popular-place-card"
          v-for="(place, index) in popularPlaces.slice(2, 5)"
          :key="index"
        >
          <img
            :src="serverHost() + '/vietnam_city/' + place.location + '.jpg'"
            :alt="place.location"
          />
        </div>
      </div>
    </div>
  </div>
  <TheFooter />
</template>

<style scoped>
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f5f5f5;
}

img {
  display: inline-block;
  border-radius: 12px;
}

.home-container {
  position: relative;
  clear: both;
  vertical-align: top;
  width: 100%;
  max-width: 1100px;
  margin: auto;
}

.h2 {
  font-weight: bolder;
  display: block;
  font-size: 28px;
}

.h4 {
  font-weight: lighter;
  font-size: 14px;
}

/*************  Popular places/city *************/

.container {
  margin-bottom: 30px;
  margin-top: 30px;
  position: relative;
}

.popular-place-card-grid {
  display: grid;
  gap: 8px;
  grid-template-rows: 270px;
}

.popular-place-card img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  margin: 0px;
}

.popular-place-card:hover {
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 100%);
  border-radius: 14px;
  cursor: pointer;
}

.popular-place-card-up-grid {
  max-width: 550px;
  max-height: 270px;
  grid-template-columns: repeat(2, 550px);
}

.popular-place-card-bottom-grid {
  margin-top: 16px;
  grid-template-columns: repeat(3, 366px);
}

/********************* recently search *************************/
.close-button {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  color: #666;
  font-size: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.close-button:hover {
  color: #333;
}

.search-slider {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 10px 0;
  scroll-snap-type: x mandatory;
}
.search-slider::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Edge */
}

.search-card {
  flex: 0 0 400px;
  background: white;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: relative;
  scroll-snap-align: start;
  transition: transform 0.3s;
  cursor: pointer;
}

.search-image {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.search-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.search-content {
  flex-grow: 1;
}

.search-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 4px 0;
}

.search-details {
  font-size: 14px;
  color: #666;
  margin: 0;
}

/***************** hotel slider *******************/

h1 {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

.slider-container {
  position: relative;
  /* padding: 0 40px; */
}

.hotel-slider {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  /* width: 100%; */
  scroll-behavior: smooth;
  padding: 10px 0;
  scroll-snap-type: x mandatory;
}
.hotel-slider::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Edge */
}

.hotel-card {
  height: 360px;
  flex: 0 0 280px;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  scroll-snap-align: start;
  transition: transform 0.3s;
  cursor: pointer;
}

.hotel-card:hover {
  transform: translateY(-5px);
}

.hotel-image {
  position: relative;
  height: 60%;
  overflow: hidden;
}

.hotel-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hotel-content {
  height: 40%;
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hotel-name {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 5px 0;
  color: #1a1a1a;
}

.hotel-location {
  font-size: 14px;
  color: #666;
  margin: 0 0 10px 0;
}

.hotel-rating {
  display: flex;
  align-items: center;
  gap: 10px;
}

.rating-badge {
  background: #003580;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: bold;
}

.rating-text {
  font-size: 14px;
  color: #333;
}

.review-count {
  color: #666;
  font-size: 14px;
}

.nav-button-container {
  width: 100%;
  position: absolute;
  inset-block-start: 50%;
  /* transform: translateY(-50%); */
  display: flex;
  justify-content: space-between;
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition:
    background-color 0.3s,
    transform 0.3s;
  z-index: 2;
}

.nav-button:hover {
  background: #f5f5f5;
  /* transform: translateY(-50%) scale(1.1); */
}

.nav-button:disabled {
  /* opacity: 0.5; */
  cursor: not-allowed;
}

.prev {
  left: -20px;
}

.next {
  right: -20px;
}

.award-badge {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: #003580;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.vl-parent {
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
