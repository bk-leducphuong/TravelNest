<script>
import TheHeader from '../components/Header.vue'
import axios from 'axios'
export default {
  components: {
    TheHeader
  },
  data() {
    return {
      reviews: [],
      notReviewed: 0,
      reviewed: 0,
      viewMode: 'all'
    }
  },
  watch: {
    reviews() {
      // calculate number of not reviewed
      this.reviews.forEach((review) => {
        if (review.review.length == 0) {
          this.notReviewed++
        } else {
          this.reviewed++
        }
      })
    }
  },
  methods: {
    async getAllReviews() {
      const response = await axios.get('http://localhost:3000/api/review/get-all-reviews', {
        withCredentials: true
      })
      this.reviews = response.data.reviews
    },
    makeReview(bookingCode) {
      this.$router.push({
        name: 'ReviewDetails',
        query: {
          bc: bookingCode
        }
      })
    }
  },
  async mounted() {
    await this.getAllReviews()
  }
}
</script>
<template>
  <TheHeader :isSearchOpen="false" />
  <div class="review-dashboard">
    <div class="left-container">
      <div class="profile-section">
        <img src="" alt="Profile" class="profile-image" />
        <div>
          <h2 class="profile-name">Đặng Đình Khải</h2>
          <a class="edit-profile">Edit your profile</a>
        </div>
      </div>

      <div class="nav-links">
        <a class="nav-link" :class="{ selected: viewMode === 'all' }" @click="viewMode = 'all'">
          All reviews
          <span class="review-count">{{ reviews.length }}</span>
        </a>
        <a
          class="nav-link"
          :class="{ selected: viewMode === 'notReviewed' }"
          @click="viewMode = 'notReviewed'"
        >
          Not reviewed yet
          <span class="review-count">{{ notReviewed }}</span>
        </a>
        <a
          class="nav-link"
          :class="{ selected: viewMode === 'reviewed' }"
          @click="viewMode = 'reviewed'"
        >
          Reviewed
          <span class="review-count">{{ reviewed }}</span>
        </a>
      </div>
    </div>
    <div class="right-container">
      <!-- <div class="right-header">
        <h2>Reviews</h2>
      </div> -->
      <div class="review-card" v-for="(review, index) in reviews" :key="index">
        <div style="display: flex; gap: 16px; align-items: start">
          <img
            :src="JSON.parse(review.hotel.image_urls)[0]"
            alt="Property"
            class="property-image"
          />
          <div class="review-content">
            <h4>You haven't reviewed your stay at {{ review.hotel.name }}</h4>
            <div>
              <span class="" v-if="review.review.length == 0"
                >You only have 60 days left to review.</span
              >
              <span class="review-status" v-else>Reviewed</span>
            </div>
            <button class="review-button" @click="makeReview(review.booking_code)">
              Review your stay
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.review-dashboard {
  /* max-width: 1200px; */
  margin: 30px 40px;
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.left-container {
  width: 30%;
}

.right-container {
  width: 70%;
}

.profile-section {
  display: flex;
  align-items: center;
  padding: 16px;
  background: white;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.profile-image {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 12px;
}

.profile-name {
  font-size: 18px;
  font-weight: 500;
  margin: 0;
}

.edit-profile {
  color: #1a73e8;
  text-decoration: none;
  font-size: 14px;
}

.nav-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: white;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.nav-link {
  display: flex;
  justify-content: space-between;
  padding: 8px 16px;
  color: #1a73e8;
  text-decoration: none;
  border-radius: 4px;
}

.nav-link:hover {
  background: #f1f3f4;
}

.review-count {
  color: #1a73e8;
  font-weight: 500;
}

.review-card {
  background: white;
  padding: 16px;
  /* margin: 16px 0; */
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.property-image {
  width: 125px;
  height: 125px;
  border-radius: 4px;
  object-fit: cover;
  align-self: center;
}

.review-button {
  background: #1a73e8;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  bottom: 0px;
}

.review-status {
  display: inline-block;
  padding: 4px 8px;
  background: #e6f4ea;
  color: #137333;
  border-radius: 4px;
  font-size: 12px;
}

.score-badge {
  background: #1a73e8;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: bold;
}

.exceptional-text {
  font-weight: 500;
  margin-left: 8px;
}

.review-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  width: 100%;
  height: 100%;
}

.selected {
  border-left: 4px solid #1a73e8;
}
</style>
