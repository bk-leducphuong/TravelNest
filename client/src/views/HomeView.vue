<script>
import TheHeader from '../components/Header.vue'
import TheFooter from '../components/Footer.vue'
import axios from 'axios'
import { mapState } from 'vuex'

export default {
  components: {
    TheHeader,
    TheFooter
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
      ])
    }
  },
  computed: {
    ...mapState('user', ['userLocation']), // Map userLocation from the user module,
    ...mapState('auth', ['isAuthenticated']),
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
        return this.sliderPosition.get(sliderRef) >= slider.scrollWidth - slider.clientWidth
      }
    }
  },
  methods: {
    redirectToSearchResults(search) {
      // Redirect user to search results page with query params
      this.$router.push({
        name: 'SearchResults',
        query: {
          location: search.location,
          dateRange: search.dateRange,
          adults: search.adults,
          children: search.children,
          rooms: search.rooms
        }
      })
    },
    // redirect user to hotel details page
    async redirectToHotelDetails(hotel) {
      // store viewed hotels into localStorage
      let viewedHotels = JSON.parse(localStorage.getItem('viewedHotels')) || []
      viewedHotels.push(hotel)
      localStorage.setItem('viewedHotels', JSON.stringify(viewedHotels))

      if (this.isAuthenticated) {
        await axios.post(
          'http://localhost:3000/api/home/recent-viewed-hotels',
          {
            hotel_id: hotel.hotel_id
          },
          { withCredentials: true }
        )
      }
      // redirect
      this.$router.push({ name: 'HotelDetails', params: { hotel_id: hotel.hotel_id }});
    },
    // load hotels which close to user
    async loadNearbyHotels() {
      if (!this.userLocation) {
        console.log('User location is not available yet')
        return // Exit the function if userLocation is not set
      }

      try {
        const response = await axios.post('http://localhost:3000/api/home/nearby-hotels', {
          location: this.userLocation
        })
        this.nearbyHotels = response.data.data
      } catch (error) {
        console.error('Error fetching nearby hotels:', error)
      }
    },
    // Load data from localStorage for recently searched
    async loadRecentSearches() {
      const searches = JSON.parse(localStorage.getItem('recentSearches')) || []

      if (this.isAuthenticated) {
        const response = await axios.get('http://localhost:3000/api/home/recent-searchs', {
          withCredentials: true
        })

        // searches = repsonse.data
      }

      searches.reverse()
      this.recentSearches = searches
    },

    // Load data from localStorage for viewed hotels
    async loadViewedHotels() {
      let hotels = JSON.parse(localStorage.getItem('viewedHotels')) || []
      if (this.isAuthenticated) {
        const response = await axios.get('http://localhost:3000/api/home/recent-viewed-hotels', {
          withCredentials: true
        })
        // response = [{hotel_id: ...}, ...]
        // hotels = response.data.data;
        //...
      }
      hotels.reverse()
      this.viewedHotels = hotels
    },

    // Static popular places data (replace with API or dynamic data)
    async loadPopularPlaces() {
      const response = await axios.get('http://localhost:3000/api/home/popular-places')

      this.popularPlaces = response.data
      // console.log(this.popularPlaces);
    },

    // Remove a recent search item
    removeSearch(index) {
      this.recentSearches.splice(index, 1)
      localStorage.setItem('recentSearches', JSON.stringify(this.recentSearches))
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
    }
  },
  watch: {
    userLocation: {
      handler(newLocation) {
        if (newLocation) {
          this.loadNearbyHotels() // Call loadNearbyHotels when userLocation is updated
        }
      },
      immediate: true // Ensures the watcher runs immediately when the component is created
    }
  },
  mounted() {
    this.loadRecentSearches()
    this.loadViewedHotels()
    this.loadNearbyHotels()
    this.loadPopularPlaces()
  }
}
</script>

<template>
  <TheHeader />
  <!-- home body -->
  <div class="home-container">
    <!-- Recently Search -->
    <div class="recent-search-container container">
      <h2 class="h2">Tìm kiếm gần đây của bạn</h2>
      <div class="slider-container">
        <div ref="recentSlider" class="search-slider">
          <div
            class="search-card"
            v-for="(search, index) in recentSearches"
            :key="index"
            @click="redirectToSearchResults(search)"
          >
            <div class="search-image">
              <img
                :src="'http://localhost:3000/vietnam_city/' + search.location + '.jpg'"
                :alt="search.location"
              />
            </div>
            <div class="search-content">
              <h2 class="search-title">{{ search.location }}</h2>
              <p class="search-details">{{ search.dateRange }}</p>
            </div>
            <button class="close-button" @click="removeSearch(index)">×</button>
          </div>
        </div>
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

    <!-- Viewed Hotels -->
    <div class="hotel-container container">
      <h2 class="h2">Bạn có còn quan tâm đến những chỗ nghỉ này?</h2>
      <div class="slider-container">
        <div ref="viewedSlider" class="hotel-slider">
          <div
            class="hotel-card"
            v-for="(hotel, index) in viewedHotels"
            :key="index"
            @click="redirectToHotelDetails(hotel)"
          >
            <div class="hotel-image">
              <img :src="hotel.image_urls" :alt="hotel.name" />
              <button class="favorite-button" @click="toggleFavorite(index)">
                {{ hotel.isFavorite ? '♥' : '♡' }}
              </button>
            </div>
            <div class="hotel-content">
              <h2 class="hotel-name">{{ hotel.name }}</h2>
              <p class="hotel-location">{{ hotel.address }}</p>
              <div class="hotel-rating">
                <span class="rating-badge">{{ hotel.overall_rating }}</span>
                <span class="rating-text">{{ hotel.reviewSummary }}</span>
                <span class="review-count">{{ hotel.reviewCount }} đánh giá</span>
              </div>
            </div>
          </div>
        </div>
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

    <!-- Nearby Hotels -->
    <div class="hotel-container container">
      <h2 class="h2">Những khách sạn gần đây</h2>
      <div class="slider-container">
        <div ref="nearbySlider" class="hotel-slider">
          <div
            class="hotel-card"
            v-for="(hotel, index) in nearbyHotels"
            :key="index"
            @click="redirectToHotelDetails(hotel)"
          >
            <div class="hotel-image">
              <img :src="hotel.image_urls" :alt="hotel.name" />
              <button class="favorite-button" @click="toggleFavorite(index)">
                {{ hotel.isFavorite ? '♥' : '♡' }}
              </button>
            </div>
            <div class="hotel-content">
              <h2 class="hotel-name">{{ hotel.name }}</h2>
              <p class="hotel-location">{{ hotel.address }}</p>
              <div class="hotel-rating">
                <span class="rating-badge">{{ hotel.overall_rating }}</span>
                <span class="rating-text">{{ hotel.reviewSummary }}</span>
                <span class="review-count">{{ hotel.reviewCount }} đánh giá</span>
              </div>
            </div>
          </div>
        </div>
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

    <!-- Popular Places -->
    <div class="popular-container container">
      <div class="popular-header">
        <h2 class="h2">Điểm đến đang thịnh hành</h2>
        <h4 class="h4">Các lựa chọn phổ biến nhất cho du khách từ Việt Nam</h4>
      </div>
      <div class="popular-place-card-up-grid popular-place-card-grid">
        <div
          class="popular-place-card"
          v-for="(place, index) in popularPlaces.slice(0, 2)"
          :key="index"
          @click="
            redirectToSearchResults({
              location: place.location,
              dateRange: '',
              adults: '',
              children: '',
              rooms: ''
            })
          "
        >
          <img
            :src="'http://localhost:3000/vietnam_city/' + place.location + '.jpg'"
            :alt="place.location"
          />
        </div>
      </div>
      <div class="popular-place-card-bottom-grid popular-place-card-grid">
        <div
          class="popular-place-card"
          v-for="(place, index) in popularPlaces.slice(2, 5)"
          :key="index"
        >
          <img
            :src="'http://localhost:3000/vietnam_city/' + place.location + '.jpg'"
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
  z-index: 10;
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
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  color: #333;
}

.search-slider {
  display: flex;
  gap: 20px;
  overflow-x: hidden;
  scroll-behavior: smooth;
  padding: 10px 0;
  scroll-snap-type: x mandatory;
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
  padding: 0 40px;
}

.hotel-slider {
  display: flex;
  gap: 20px;
  overflow-x: hidden;
  scroll-behavior: smooth;
  padding: 10px 0;
  scroll-snap-type: x mandatory;
}

.hotel-card {
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
  height: 200px;
  overflow: hidden;
}

.hotel-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.favorite-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition:
    background-color 0.3s,
    transform 0.3s;
}

.favorite-button:hover {
  background: #f8f8f8;
  transform: scale(1.1);
}

.favorite-button.active {
  color: red;
}

.hotel-content {
  padding: 15px;
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
  z-index: 10;
}

.nav-button:hover {
  background: #f5f5f5;
  /* transform: translateY(-50%) scale(1.1); */
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.prev {
  left: 0;
}

.next {
  right: 0;
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
</style>
