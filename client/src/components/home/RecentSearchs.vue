<template>
  <div class="recent-search-container container" v-if="recentSearches.length > 0">
    <h2 class="h2">{{ $t('userHome.recentSearches') }}</h2>
    <div class="slider-container">
      <div
        ref="recentSlider"
        class="search-slider"
        @scroll="(event) => handleScroll(event)"
      >
        <div
          class="search-card"
          v-for="(search, index) in recentSearches"
          :key="index"
          @click="redirectToSearchResults(search)"
        >
          <div class="search-image">
            <img
              :src="'assets/vietnam_city/' + search.location + '.jpg'"
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
          <button class="close-button" @click.stop="removeSearch(search, index)">×</button>
        </div>
      </div>
      <div class="nav-button-container" v-if="recentSearches.length > 0">
        <button
          class="nav-button prev"
          :disabled="disableScrollLeft"
          @click="scrollLeft"
        >
          ‹
        </button>
        <button
          class="nav-button next"
          :disabled="disableScrollRight"
          @click="scrollRight"
        >
          ›
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { HomeService } from '@/services/home.service'
import errorHandler from '@/request/errorHandler'

export default {
  name: 'RecentSearchs',
  props: {
    recentSearches: {
      type: Array,
      default: () => []
    },
    isUserAuthenticated: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:recentSearches'],
  data() {
    return {
      sliderPosition: 0
    }
  },
  computed: {
    disableScrollLeft() {
      return this.sliderPosition === 0
    },
    disableScrollRight() {
      const slider = this.$refs.recentSlider
      if (!slider) return true
      return this.sliderPosition >= slider.scrollWidth - slider.clientWidth
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
    async removeSearch(removedSearch, searchIndex) {
      try {
        const updatedSearches = [...this.recentSearches]
        updatedSearches.splice(searchIndex, 1)
        this.$emit('update:recentSearches', updatedSearches)
        
        // Update local storage
        if (!this.isUserAuthenticated) {
          localStorage.setItem('recentSearches', JSON.stringify(updatedSearches))
        }

        // Remove from database if authenticated
        if (this.isUserAuthenticated) {
          await HomeService.removeRecentSearch(removedSearch.search_id)
        }
      } catch (error) {
        errorHandler(error)
      }
    },
    scrollLeft() {
      const slider = this.$refs.recentSlider
      this.sliderPosition = Math.max(this.sliderPosition - 300, 0)
      slider.scrollTo({ left: this.sliderPosition, behavior: 'smooth' })
    },
    scrollRight() {
      const slider = this.$refs.recentSlider
      this.sliderPosition = Math.min(
        this.sliderPosition + 300,
        slider.scrollWidth - slider.clientWidth
      )
      slider.scrollTo({ left: this.sliderPosition, behavior: 'smooth' })
    },
    handleScroll(event) {
      const slider = event.target
      this.sliderPosition = slider.scrollLeft
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/index.scss';

.recent-search-container {
  margin-bottom: 30px;
  margin-top: 30px;
  position: relative;
}

.h2 {
  font-weight: bolder;
  display: block;
  font-size: 28px;
}

.slider-container {
  position: relative;
}

.search-slider {
  display: flex;
  gap: $spacing-lg;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: $spacing-sm 0;
  scroll-snap-type: x mandatory;

  &::-webkit-scrollbar {
    display: none;
  }
}

.search-card {
  flex: 0 0 400px;
  background: $white;
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

  &:hover {
    transform: translateY(-2px);
  }
}

.search-image {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }
}

.search-content {
  flex-grow: 1;
}

.search-title {
  font-size: $font-size-base;
  font-weight: 600;
  color: $text-primary;
  margin: 0 0 4px 0;
}

.search-details {
  font-size: $font-size-sm;
  color: $text-secondary;
  margin: 0;
}

.close-button {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  color: $text-secondary;
  font-size: 25px;
  @include flex-center;
  z-index: 2;
  transition: color 0.2s ease;

  &:hover {
    color: $text-primary;
  }
}

.nav-button-container {
  width: 100%;
  position: absolute;
  inset-block-start: 50%;
  display: flex;
  justify-content: space-between;
  pointer-events: none;
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  background: $white;
  border: 1px solid #ddd;
  border-radius: 50%;
  cursor: pointer;
  @include flex-center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s;
  z-index: 2;
  pointer-events: all;

  &:hover:not(:disabled) {
    background: #f5f5f5;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &.prev {
    left: -20px;
  }

  &.next {
    right: -20px;
  }
}
</style>
