<template>
  <div class="header">
    <div class="container">
      <div class="inner-wrap">
        <div class="inner-logo">
          <a href="/"><strong>Booking.com</strong></a>
        </div>
        <div class="inner-login">
          <ul>
            <li><strong>VND</strong></li>
            <li><img src="../assets/header/Vn@3x.png" alt="Vietnam" /></li>
            <li><i class="fa-regular fa-circle-question"></i></li>
            <li>
              <span><a href="/join">Đăng chỗ nghỉ của Quý vị</a></span>
            </li>
            <li v-if="!this.isAuthenticated || this.getUserRole != 'customer'">
              <a href="/login" class="login" style="margin-right: 5px">Đăng ký</a>
              <a href="/login" class="login" style="margin-left: 5px">Đăng nhập</a>
            </li>
            <li v-if="this.isAuthenticated && this.getUserRole === 'customer'">
              <AccountMenu />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <div class="slide">
    <div class="container">
      <div class="inner-wrap" v-if="this.$route.name === 'Home'">
        <strong>Tìm chỗ nghỉ tiếp theo</strong>
        <br />
        <p>Tìm ưu đãi khách sạn, chỗ nghỉ dạng nhà và nhiều hơn nữa...</p>
      </div>
    </div>
  </div>

  <!-- Search bar -->
  <div class="search" v-if="isSearchOpen">
    <div class="container">
      <div class="search-bar">
        <!-- Location input -->
        <input
          type="text"
          class="search-input"
          id="local"
          v-model="selectedLocation"
          placeholder="Bạn muốn đến đâu?"
          @click="toggleLocationPopup"
          v-click-outside="hideLocationPopup"
        />

        <!-- Location popup -->
        <div class="location-popup" v-if="showLocationPopup">
          <h3>Điểm đến được ưa thích gần đây</h3>
          <ul class="location-list">
            <li
              class="location-item"
              v-for="location in locations"
              :key="location.name"
              @click="selectLocation(location)"
            >
              <div class="location-icon"></div>
              <div class="location-info">
                <span class="location-name">{{ location.name }}</span>
                <span class="location-country">{{ location.country }}</span>
              </div>
            </li>
          </ul>
        </div>

        <!-- Date picker input -->
        <div class="date-picker">
          <input
            class="search-input"
            type="text"
            placeholder="Nhận phòng - Trả phòng"
            v-model="dateRange"
            ref="dateInput"
          />
        </div>

        <!-- Guest room input -->
        <div class="guest-room-wrapper" v-click-outside="hideGuestSelector">
          <input
            type="text"
            v-model="guestDetails"
            class="search-input"
            @click="toggleGuestSelector"
            readonly
          />

          <!-- Guest room selector -->
          <div v-if="showGuestSelector" class="guest-room-selector" id="guest-room-selector">
            <div class="selector-item">
              <span>Người lớn</span>
              <div class="counter">
                <button class="decrement" @click="updateGuests('adults', 'decrement')">-</button>
                <span>{{ adults }}</span>
                <button class="increment" @click="updateGuests('adults', 'increment')">+</button>
              </div>
            </div>
            <div class="selector-item">
              <span>Trẻ em <small>(0 - 17 tuổi)</small></span>
              <div class="counter">
                <button class="decrement" @click="updateGuests('children', 'decrement')">-</button>
                <span>{{ children }}</span>
                <button class="increment" @click="updateGuests('children', 'increment')">+</button>
              </div>
            </div>
            <div class="selector-item">
              <span>Phòng</span>
              <div class="counter">
                <button class="decrement" @click="updateGuests('rooms', 'decrement')">-</button>
                <span>{{ rooms }}</span>
                <button class="increment" @click="updateGuests('rooms', 'increment')">+</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Search button -->
        <button class="search-button" @click="submitSearch">Tìm</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import flatpickr from 'flatpickr'
import 'flatpickr/dist/flatpickr.css'
import { mapActions, mapState, mapGetters } from 'vuex'
import AccountMenu from './user/AccountMenu.vue'

export default {
  props: {
    isSearchOpen: {
      type: Boolean,
      required: true
    }
  },
  components: {
    AccountMenu
  },
  data() {
    return {
      locations: [
        { name: 'Phú Quốc', country: 'Việt Nam' },
        { name: 'Hà Nội', country: 'Việt Nam' },
        { name: 'Sa Pa', country: 'Việt Nam' },
        { name: 'Đà Lạt', country: 'Việt Nam' },
        { name: 'Đà Nẵng', country: 'Việt Nam' }
      ],
      showLocationPopup: false,
      showGuestSelector: false
    }
  },
  computed: {
    ...mapGetters('auth', ['isAuthenticated', 'getUserRole']),
    ...mapGetters('search', ['getSearchData']),
    selectedLocation: {
      get() {
        return this.getSearchData?.location || ''
      },
      set(value) {
        this.$store.dispatch('search/updateLocation', value)
      }
    },
    dateRange: {
      get() {
        return this.getSearchData?.dateRange || ''
      },
      set(value) {
        this.$store.dispatch('search/updateDateRange', value)
      }
    },
    adults: {
      get() {
        return this.getSearchData?.adults || 2
      },
      set(value) {
        this.$store.dispatch('search/updateAdults', value)
      }
    },
    children: {
      get() {
        return this.getSearchData?.children || 0
      },
      set(value) {
        this.$store.dispatch('search/updateChildren', value)
      }
    },
    rooms: {
      get() {
        return this.getSearchData?.rooms || 1
      },
      set(value) {
        this.$store.dispatch('search/updateRooms', value)
      }
    },
    guestDetails() {
      return `${this.adults} người lớn · ${this.children} trẻ em · ${this.rooms} phòng`
    }
  },
  mounted() {
    if (this.isSearchOpen) {
      flatpickr(this.$refs.dateInput, {
        dateFormat: 'd/m/Y', // Định dạng ngày
        locale: 'vn', // Ngôn ngữ tiếng Việt cho tên ngày tháng
        mode: 'range', // Cho phép chọn dải ngày

        minDate: 'today', // Không cho phép chọn ngày trong quá khứ
        showMonths: 2, // Hiển thị 2 tháng cạnh nhau
        onChange: function (selectedDates, dateStr, instance) {},
        mode: 'range',
        locale: {
          rangeSeparator: ' đến ' // Thay "to" bằng "đến"
        },
        onValueUpdate: function (selectedDates, dateStr, instance) {
          // Thêm "Từ" vào trước ngày bắt đầu
          const display = instance.element.value
          instance.element.value = 'Từ ' + display
        }
      }) // Run immediately if `isSearchOpen` already has a value
    }
  },
  methods: {
    toggleLocationPopup() {
      this.showLocationPopup = !this.showLocationPopup
    },

    selectLocation(location) {
      this.selectedLocation = location.name
      this.showLocationPopup = false
    },
    hideLocationPopup() {
      this.showLocationPopup = false
    },
    toggleGuestSelector() {
      this.showGuestSelector = !this.showGuestSelector
    },
    updateGuests(type, action) {
      if (type === 'adults') {
        if (action === 'increment' && this.adults < 30) this.adults++
        else if (action === 'decrement' && this.adults > 1) this.adults--
      } else if (type === 'children') {
        if (action === 'increment' && this.children < 10) this.children++
        else if (action === 'decrement' && this.children > 0) this.children--
      } else if (type === 'rooms') {
        if (action === 'increment' && this.rooms < 30) this.rooms++
        else if (action === 'decrement' && this.rooms > 1) this.rooms--
      }
    },
    hideGuestSelector() {
      this.showGuestSelector = false
    },

    async submitSearch() {
      const searchData = {
        location: this.selectedLocation,
        dateRange: this.dateRange,
        adults: this.adults,
        children: this.children,
        rooms: this.rooms
      }
      // store search informations
      let searchHistory = JSON.parse(localStorage.getItem('recentSearches')) || []
      if (searchHistory.length > 5) {
        searchHistory.shift()
      }
      searchHistory.push(searchData)
      localStorage.setItem('recentSearches', JSON.stringify(searchHistory))

      // Redirect user to search results page with query params
      this.$router.push({
        name: 'SearchResults',
        query: {
          location: this.selectedLocation,
          dateRange: this.dateRange,
          adults: this.adults,
          children: this.children,
          rooms: this.rooms
        }
      })
    },
  }
}
</script>

<style scoped>
body {
  /* font-family: Arial, sans-serif; */
  margin: 0;
  padding: 0;
  /* background-color: #f2f2f2; */
}

.header {
  background-color: #003b95;
  padding-bottom: 30px;
}

.header .inner-wrap {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  align-items: center;
}

.header .inner-logo strong {
  font-size: 24px;
  color: #fff;
}

.header .inner-login ul {
  display: flex;
  color: #fff;
  list-style-type: none;
  align-items: center;
  margin-bottom: 0;
}

.header .inner-login ul li {
  padding: 10px;
  margin-left: 15px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
}

.header .inner-login ul li:hover {
  background-color: #1a4fa0;
}

.header .inner-login ul li img {
  border-radius: 50%;
  height: 18px;
  overflow: hidden;
  width: auto;
}

.header .inner-login ul li span {
  font-weight: 600;
}

.header .inner-login ul .login {
  padding: 5px 10px;
  color: #1d5fc2;
  font-weight: 500;
  background-color: #fff;
  border-radius: 5px;
}

.header .inner-login ul .login:hover {
  background-color: #f0f6fd;
}

/* end header  */

/* slide  */
.slide {
  position: relative;
  background-color: #003b95;
  padding-bottom: 30px;
}

.slide .img {
  width: 100%;
  height: auto;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  height: 350px;
  display: flex;
  position: relative;
  color: #fff;
  z-index: 1;
}

.slide .inner-wrap {
  position: relative;
  top: -30px;
  color: #fff;
}

.slide .inner-wrap strong {
  font-size: 50px;
}

.slide .inner-wrap p {
  margin-left: 8px;
  font-size: 24px;
}

/* end slide  */

/* search */
.search-bar {
  background-color: #ffb700;
  width: 1100px;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4px;
  box-sizing: border-box;
  border-radius: 4px;
  position: relative;
  left: 50%;
  top: -30px;
  transform: translateX(-50%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 9999;
}

.search-input {
  height: 50px;
  padding: 0 10px 0 40px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  background-repeat: no-repeat;
  background-position: 10px center;
  background-size: 16px;
  width: 30%;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>');
}

.location-popup {
  position: absolute;
  top: 100%;
  left: 0;
  width: 30%;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.15);
  padding: 16px;
  /* z-index: 99999; */
}

.location-popup h3 {
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 16px;
  color: #333;
}

.location-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.location-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  cursor: pointer;
}

.location-item:hover {
  background-color: #f2f2f2;
}

.location-icon {
  width: 24px;
  height: 24px;
  margin-right: 16px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>');
}

.location-info {
  display: flex;
  flex-direction: column;
}

.location-name {
  font-weight: bold;
  color: #333;
}

.location-country {
  font-size: 14px;
  color: #666;
}

.date-picker {
  width: 30%;
}

.date-picker .search-input {
  height: 50px;
  padding: 0 10px 0 40px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  background-repeat: no-repeat;
  background-position: 10px center;
  background-size: 16px;
  width: 100%;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>');
}

.guest-room-wrapper {
  position: relative;
  display: inline-block;
  width: 30%;
}

.guest-room-wrapper input {
  width: 100%;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>');
}

#guest-room-selector {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  z-index: 100;
  width: 100%;
}

.guest-room-wrapper .selector-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.guest-room-wrapper .counter {
  display: flex;
  align-items: center;
}

.guest-room-wrapper button {
  width: 30px;
  height: 30px;
  font-size: 18px;
  text-align: center;
  line-height: 30px;
  border: 1px solid #007bff;
  background-color: #fff;
  color: #007bff;
  border-radius: 4px;
  cursor: pointer;
}

.guest-room-wrapper button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.guest-room-wrapper span {
  margin: 0 10px;
  font-size: 16px;
}

.search-button {
  background-color: #3576d2;
  color: #fff;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  font-weight: bold;
  border-radius: 4px;
  font-size: 18px;
  width: 8%;
  height: 50px;
}

/* end search  */
</style>
