<template>
  <div class="hotel-container container" v-if="nearbyHotels.length > 0">
    <h2 class="h2">{{ $t('userHome.nearbyHotels') }}</h2>
    <loading
      v-model:active="isLoading"
      :can-cancel="true"
      :color="`#003b95`"
      :is-full-page="false"
    />
    <div class="slider-container">
      <div ref="nearbySlider" class="hotel-slider" @scroll="(event) => handleScroll(event)">
        <div
          class="hotel-card"
          v-for="(hotel, index) in nearbyHotels"
          :key="index"
          @click="redirectToHotelDetails(hotel)"
        >
          <div class="hotel-image">
            <img v-if="hotel.image_urls" :src="JSON.parse(hotel.image_urls)[0]" :alt="hotel.name" />
            <img v-else :src="'/assets/hotels/no-image.png'" :alt="hotel.name" />
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
        <button class="nav-button prev" :disabled="disableScrollLeft" @click="scrollLeft">‹</button>
        <button class="nav-button next" :disabled="disableScrollRight" @click="scrollRight">
          ›
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import Loading from 'vue-loading-overlay';
  import 'vue-loading-overlay/dist/css/index.css';
  import SavedHotelIcon from '@/components/SavedHotelIcon.vue';
  import { HomeService } from '@/services/home.service';
  import errorHandler from '@/request/errorHandler';

  export default {
    name: 'NearbyHotels',
    components: {
      Loading,
      SavedHotelIcon,
    },
    props: {
      userLocation: {
        type: String,
        default: null,
      },
    },
    computed: {
      ...mapGetters('auth', ['isUserAuthenticated']),
    },
    data() {
      return {
        nearbyHotels: [],
        isLoading: false,
        sliderPosition: 0,
      };
    },
    computed: {
      disableScrollLeft() {
        return this.sliderPosition === 0;
      },
      disableScrollRight() {
        const slider = this.$refs.nearbySlider;
        if (!slider) return true;
        return this.sliderPosition >= slider.scrollWidth - slider.clientWidth;
      },
    },
    watch: {
      userLocation: {
        handler(newLocation) {
          if (newLocation) {
            this.loadNearbyHotels();
          }
        },
        immediate: true,
      },
    },
    methods: {
      ...mapActions('search', ['updateLocation']),
      async loadNearbyHotels() {
        try {
          this.isLoading = true;
          const response = await HomeService.getNearbyHotels(this.userLocation);
          this.nearbyHotels = response.data || [];
        } catch (error) {
          errorHandler(error);
        } finally {
          this.isLoading = false;
        }
      },
      async redirectToHotelDetails(hotel) {
        try {
          this.updateLocation(hotel.city);
          const hotel_id = hotel.hotel_id;

          // Save viewed hotel to localStorage
          let viewedHotels = localStorage.getItem('viewedHotels')
            ? JSON.parse(localStorage.getItem('viewedHotels'))
            : [];

          const index = viewedHotels.findIndex((hotelId) => hotelId === hotel_id);

          if (index !== -1) {
            viewedHotels.splice(index, 1);
          }
          viewedHotels.push(hotel_id);
          localStorage.setItem('viewedHotels', JSON.stringify(viewedHotels));

          // Record hotel view if authenticated
          if (this.isUserAuthenticated) {
            try {
              await HomeService.recordHotelView(hotel_id);
            } catch (error) {
              errorHandler(error);
            }
          }

          this.$router.push({ name: 'HotelDetails', params: { hotel_id: hotel_id } });
        } catch (error) {
          console.error('Error redirecting to hotel details:', error);
        }
      },
      scrollLeft() {
        const slider = this.$refs.nearbySlider;
        this.sliderPosition = Math.max(this.sliderPosition - 300, 0);
        slider.scrollTo({ left: this.sliderPosition, behavior: 'smooth' });
      },
      scrollRight() {
        const slider = this.$refs.nearbySlider;
        this.sliderPosition = Math.min(
          this.sliderPosition + 300,
          slider.scrollWidth - slider.clientWidth
        );
        slider.scrollTo({ left: this.sliderPosition, behavior: 'smooth' });
      },
      handleScroll(event) {
        const slider = event.target;
        this.sliderPosition = slider.scrollLeft;
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/styles/index.scss';

  .hotel-container {
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

  .hotel-slider {
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

  .hotel-card {
    height: 360px;
    flex: 0 0 280px;
    background: $white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    position: relative;
    scroll-snap-align: start;
    transition: transform 0.3s;
    cursor: pointer;

    &:hover {
      transform: translateY(-5px);
    }
  }

  .hotel-image {
    position: relative;
    height: 60%;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 0;
    }
  }

  .hotel-content {
    height: 40%;
    padding: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .hotel-name {
    font-size: $font-size-base;
    font-weight: 600;
    margin: 0 0 5px 0;
    color: $text-primary;
  }

  .hotel-location {
    font-size: $font-size-sm;
    color: $text-secondary;
    margin: 0 0 10px 0;
  }

  .hotel-rating {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
  }

  .rating-badge {
    background: $primary-color;
    color: $white;
    padding: 4px 8px;
    border-radius: $border-radius-sm;
    font-weight: bold;
  }

  .rating-text {
    font-size: $font-size-sm;
    color: $text-primary;
  }

  .review-count {
    color: $text-secondary;
    font-size: $font-size-sm;
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
