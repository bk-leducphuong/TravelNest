<script>
import TheHeader from '@/components/Header.vue'
export default {
  components: {
    TheHeader
  }
}
</script>
<template>
  <TheHeader :isSearchOpen="false" />
  <div class="review-container">
    <!-- Section 1: Service Rating -->
    <div class="review-section">
      <h3>Rate Our Services (optional)</h3>
      <div>
        <label>Staff Friendliness</label>
        <div class="rating-group faces">
          <input type="radio" id="staff-1" name="staff" value="1" /><label for="staff-1">😡</label>
          <input type="radio" id="staff-2" name="staff" value="2" /><label for="staff-2">😟</label>
          <input type="radio" id="staff-3" name="staff" value="3" /><label for="staff-3">😐</label>
          <input type="radio" id="staff-4" name="staff" value="4" /><label for="staff-4">😊</label>
          <input type="radio" id="staff-5" name="staff" value="5" /><label for="staff-5">😍</label>
        </div>
      </div>
      <div>
        <label>Cleanliness</label>
        <div class="rating-group faces">
          <input type="radio" id="cleanliness-1" name="cleanliness" value="1" /><label
            for="cleanliness-1"
            >😡</label
          >
          <input type="radio" id="cleanliness-2" name="cleanliness" value="2" /><label
            for="cleanliness-2"
            >😟</label
          >
          <input type="radio" id="cleanliness-3" name="cleanliness" value="3" /><label
            for="cleanliness-3"
            >😐</label
          >
          <input type="radio" id="cleanliness-4" name="cleanliness" value="4" /><label
            for="cleanliness-4"
            >😊</label
          >
          <input type="radio" id="cleanliness-5" name="cleanliness" value="5" /><label
            for="cleanliness-5"
            >😍</label
          >
        </div>
      </div>
    </div>

    <!-- Section 2: Overall Rating -->
    <div class="review-section">
      <h3>Overall Rating</h3>
      <p>How was your stay experienced at this hotel?</p>
      <div class="rating-group faces">
        <input type="radio" id="overall-1" name="overall" value="1" /><label for="overall-1"
          >😡</label
        >
        <input type="radio" id="overall-2" name="overall" value="2" /><label for="overall-2"
          >😟</label
        >
        <input type="radio" id="overall-3" name="overall" value="3" /><label for="overall-3"
          >😐</label
        >
        <input type="radio" id="overall-4" name="overall" value="4" /><label for="overall-4"
          >😊</label
        >
        <input type="radio" id="overall-5" name="overall" value="5" /><label for="overall-5"
          >😍</label
        >
      </div>
    </div>

    <!-- Section 3: Comments -->
    <div class="review-section">
      <h3>Write Your Comments</h3>
      <p>Please write your reviews about your feeling during staying at this hotel.</p>
      <textarea name="comments" id="comments" placeholder="Write your feedback here..."></textarea>
      <div style="display: flex; align-items: center; gap: 5px;">
        <input type="checkbox" name="booking_code" value="bc" style="width: 18px; height: 18px" />
        <span for="booking_code">Post this review as a anonymous</span>
      </div>
    </div>

    <!-- Submit Button -->
    <button type="submit">Submit Review</button>
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
.faces input:checked + label {
  transform: scale(1.3);
  color: #007bff;
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
