<script>
import TheHeader from '@/components/Header.vue'
import axios from 'axios'
import { useToast } from 'vue-toastification'

export default {
  components: {
    TheHeader
  },
  setup() {
    const toast = useToast()
    return {
      toast
    }
  },
  data() {
    return {
      reviewCriteria: [
        {
          name: 'Cleanliness',
          value: null
        },
        {
          name: 'Staff',
          value: null
        },
        {
          name: 'Facilities',
          value: null
        },
        {
          name: 'Comfort',
          value: null
        },
        {
          name: 'Location',
          value: null
        },
        {
          name: 'Value for money',
          value: null
        }
      ],
      overallRating: null,
      comment: null
    }
  },
  methods: {
    async validateReview() {
      try {
        const response = await axios.post(
          'http://localhost:3000/api/review/validate-review',
          {
            bookingCode: this.$route.query.bc,
            hotelId: this.$route.query.hid,
            hotelName: this.$route.query.hn
          },
          {
            withCredentials: true
          }
        )
      } catch (error) {
        console.log(error)
        this.$router.push('/reviews')
      }
    },
    async postReview() {
      try {
        if (!this.checkValidReview()) {
          this.toast.error('Please fill in all the required fields')
          return
        }
        const response = await axios.post(
          'http://localhost:3000/api/review/post-review',
          {
            hotelId: this.$route.query.hid,
            overallRating: this.overallRating,
            comment: this.comment,
            reviewCriteria: this.reviewCriteria,
            bookingCode: this.$route.query.bc
          },
          {
            withCredentials: true
          }
        )

        this.toast.success('Review posted successfully')
        this.$router.push('/reviews')
      } catch (error) {
        console.log(error)
        this.$router.push('/reviews')
      }
    },
    checkValidReview() {
      if (this.overallRating == null || this.comment == null) {
        return false
      }else {
        return true
      }
    },
    async checkAlreadyReviewed() {
      try {
        const response = await axios.post(
          'http://localhost:3000/api/review/check-already-reviewed',
          {
            bookingCode: this.$route.query.bc,
            hotelId: this.$route.query.hid
          },
          {
            withCredentials: true
          }
        )
        if (response.data.success) {
          //TODO: redirect to edit review page
          this.$router.push('/reviews') // test
        }
      } catch (error) {
        console.log(error)
      }
    }
  },
  async mounted() {
    await this.validateReview()
    await this.checkAlreadyReviewed()
  }
}
</script>
<template>
  <TheHeader :isSearchOpen="false" />
  <div class="review-container">
    <div class="review-section">
      <h3>Review {{ this.$route.query.hn }}</h3>
      <p>Let me know how your stay was.</p>
    </div>
    <!-- Section 1: Service Rating -->
    <div class="review-section">
      <h3>Rate Our Services (optional)</h3>
      <div v-for="criteria in reviewCriteria" :key="criteria.name">
        <label>{{ criteria.name }}</label>
        <div class="rating-group faces">
          <input type="radio" v-model="criteria.value" value="1" :id="`${criteria.name}-1`" />
          <label :for="`${criteria.name}-1`" :class="{ selected: criteria.value == 1 }">😡</label>
          <input type="radio" v-model="criteria.value" value="2" :id="`${criteria.name}-2`" />
          <label :for="`${criteria.name}-2`" :class="{ selected: criteria.value == 2 }">😟</label>
          <input type="radio" v-model="criteria.value" value="3" :id="`${criteria.name}-3`" />
          <label :for="`${criteria.name}-3`" :class="{ selected: criteria.value == 3 }">😐</label>
          <input type="radio" v-model="criteria.value" value="4" :id="`${criteria.name}-4`" />
          <label :for="`${criteria.name}-4`" :class="{ selected: criteria.value == 4 }">😊</label>
          <input type="radio" v-model="criteria.value" value="5" :id="`${criteria.name}-5`" />
          <label :for="`${criteria.name}-5`" :class="{ selected: criteria.value == 5 }">😍</label>
        </div>
      </div>
    </div>

    <!-- Section 2: Overall Rating -->
    <div class="review-section">
      <h3>Overall Rating</h3>
      <p>How was your stay experienced at this hotel?</p>
      <div class="rating-group faces">
        <input type="radio" v-model="overallRating" value="1" :id="`overall-1`" />
        <label :for="`overall-1`" :class="{ selected: overallRating == 1 }">😡</label>
        <input type="radio" v-model="overallRating" value="2" :id="`overall-2`" />
        <label :for="`overall-2`" :class="{ selected: overallRating == 2 }">😟</label>
        <input type="radio" v-model="overallRating" value="3" :id="`overall-3`" />
        <label :for="`overall-3`" :class="{ selected: overallRating == 3 }">😐</label>
        <input type="radio" v-model="overallRating" value="4" :id="`overall-4`" />
        <label :for="`overall-4`" :class="{ selected: overallRating == 4 }">😊</label>
        <input type="radio" v-model="overallRating" value="5" :id="`overall-5`" />
        <label :for="`overall-5`" :class="{ selected: overallRating == 5 }">😍</label>
      </div>
    </div>

    <!-- Section 3: Comments -->
    <div class="review-section">
      <h3>Write Your Comments</h3>
      <p>Please write your reviews about your feeling during staying at this hotel.</p>
      <textarea name="comments" id="comments" v-model="comment" placeholder="Write your feedback here..."></textarea>
      <div style="display: flex; align-items: center; gap: 5px">
        <input type="checkbox" name="booking_code" value="bc" style="width: 18px; height: 18px" />
        <span for="booking_code">Post this review as a anonymous</span>
      </div>
    </div>

    <!-- Submit Button -->
    <button type="submit" @click="postReview">Submit Review</button>
  </div>
</template>
<style scoped>
.review-container {
  margin: 40px;
}

.review-section {
  margin: 20px auto;
  padding: 20px;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
}
h1 {
  text-align: center;
  margin-bottom: 20px;
}
.section-container {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f9f9f9;
}
h3 {
  margin-bottom: 15px;
}
.rating-group {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 10px 0;
}
.faces input {
  display: none;
}
.faces label {
  font-size: 2rem;
  cursor: pointer;
  transition: transform 0.2s;
}
.faces label:hover {
  transform: scale(1.2);
}

.selected {
  transform: scale(1.3);
  color: #007bff;
  border: #007bff solid 2px;
  border-radius: 50%;
}

textarea {
  width: 100%;
  min-height: 200px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
}
button {
  width: 100%;
  padding: 10px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}
button:hover {
  background: #0056b3;
}
</style>
