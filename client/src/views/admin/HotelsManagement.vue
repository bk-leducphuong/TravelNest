<script>
import axios from 'axios'
import { mapMutations } from 'vuex'

export default {
  data() {
    return {
      hotels: []
    }
  },
  methods: {
    ...mapMutations('auth', ['setManagingHotelId']),
    selectHotel(hotelId) {
      this.setManagingHotelId(hotelId)
      this.$router.push(`/admin/${hotelId}/home`)
    },
    async getAllManagingHotels() {
      const response = await axios.get('http://localhost:3000/api/admin/hotels-management', {
        withCredentials: true
      })
      this.hotels = response.data.hotels
    }
  },
  async mounted() {
    await this.getAllManagingHotels()
  }
}
</script>
<template>
  <!-- header  -->
  <div class="top-header">
    <div class="" style="padding: 0px 20px">
      <div class="inner-wrap">
        <div class="inner-logo">
          <strong @click="this.$router.push('/')" style="cursor: pointer">Booking.com</strong>
        </div>
        <div class="inner-login">
          <ul>
            <li><strong>VND</strong></li>
            <li><img src="" alt="" /></li>
            <li><i class="fa-regular fa-circle-question"></i></li>
            <li class="login">Trợ giúp</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <!-- end header  -->
  <div class="container">
    <div class="header">
      <h1>Hotel Management</h1>
      <button class="add-hotel-btn" @click="this.$router.push('/join/become-a-host')">
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add New Hotel
      </button>
    </div>

    <div class="search-box">
      <input type="text" class="search-input" placeholder="Search hotels..." />
      <button class="filter-btn">
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        Filters
      </button>
    </div>

    <div
      class="not-found-hotels"
      style="margin-top: 80px; text-align: center; font-size: 30px; font-weight: 700"
      v-if="hotels.length == 0"
    >
      <span>Bạn chưa đăng khách sạn nào</span>
    </div>
    <div class="hotel-grid">
      <!-- Hotel Card 1 -->

      <div class="hotel-card" v-for="hotel in hotels" :key="hotel.hotel_id">
        <img src="" alt="Luxury Hotel" class="hotel-image" />
        <div class="hotel-info">
          <h2 class="hotel-name">{{ hotel.name }}</h2>
          <div class="hotel-location">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {{ hotel.address }}
          </div>
          <div class="hotel-stats">
            <div class="stat">
              <span class="stat-value">120</span>
              <span class="stat-label">Rooms</span>
            </div>
            <div class="stat">
              <span class="stat-value">85%</span>
              <span class="stat-label">Occupancy</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ hotel.overall_rating }}</span>
              <span class="stat-label">Rating</span>
            </div>
          </div>
          <div class="hotel-actions">
            <button class="action-btn manage-btn" @click="selectHotel(hotel.hotel_id)">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Manage
            </button>
            <button class="action-btn view-btn">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              View
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
/* header  */
.top-header {
  background-color: #003b95;
  margin-bottom: 35px;
}

.top-header .inner-wrap {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  align-items: center;
}

.top-header .inner-logo strong {
  font-size: 24px;
  color: #fff;
}

.top-header .inner-login ul {
  display: flex;
  color: #fff;
  list-style-type: none;
  align-items: center;
  margin-bottom: 0;
}

.top-header .inner-login ul li {
  padding: 10px;
  margin-left: 15px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
}

.top-header .inner-login ul li:hover {
  background-color: #1a4fa0;
}

.top-header .inner-login ul li img {
  border-radius: 50%;
  height: 18px;
  overflow: hidden;
  width: auto;
}
.top-header .inner-login ul li span {
  font-weight: 600;
}

.top-header .inner-login ul .login {
  padding: 5px 10px;
  color: #1d5fc2;
  font-weight: 500;
  background-color: #fff;
  border-radius: 5px;
}
.top-header .inner-login ul .guides {
  padding: 5px 10px;
  color: #1d5fc2;
  font-weight: 500;
  background-color: #fff;
  border-radius: 5px;
}

.top-header .inner-login ul .login:hover {
  background-color: #f0f6fde8;
}
.top-header .inner-login ul .guides:hover {
  background-color: #f0f6fde8;
}
/* end header  */

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.header h1 {
  color: #2d3748;
  font-size: 24px;
  font-weight: 600;
}

.add-hotel-btn {
  padding: 10px 20px;
  background: #6366f1;
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.hotel-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  padding: 10px;
}

.hotel-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
}

.hotel-card:hover {
  transform: translateY(-4px);
}

.hotel-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.hotel-info {
  padding: 20px;
}

.hotel-name {
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 8px;
}

.hotel-location {
  color: #718096;
  font-size: 14px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.hotel-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-weight: 600;
  color: #2d3748;
}

.stat-label {
  font-size: 12px;
  color: #718096;
}

.hotel-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.manage-btn {
  background: #6366f1;
  color: white;
}

.view-btn {
  background: #e2e8f0;
  color: #4a5568;
}

.search-box {
  display: flex;
  gap: 10px;
  margin-bottom: 24px;
}

.search-input {
  flex: 1;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
}

.filter-btn {
  padding: 12px 20px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #4a5568;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
