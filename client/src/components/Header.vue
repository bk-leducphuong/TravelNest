<template>
  <LanguageSwitch @close-language-popup="closeLanguagePopup" v-if="showLanguagePopup" />
  <div class="header">
    <div class="container">
      <div class="inner-wrap">
        <div class="inner-logo">
          <a @click="this.$router.push('/')"><strong>TravelNest</strong></a>
        </div>
        <div class="inner-login">
          <ul>
            <li><strong>VND</strong></li>
            <li @click="openLanguagePopup()">
              <!-- <img
                v-if="getUserLanguage"
                :src="`https://flagcdn.com/w40/${getUserLanguage.split('-')[1].toLowerCase()}.png`"
                style="width: 20px; height: 20px"
                alt="Vietnam"
              /> -->
              <img
                src="https://flagcdn.com/w40/us.png"
                style="width: 20px; height: 20px"
                alt="English"
              />
            </li>
            <li><i class="fa-regular fa-circle-question"></i></li>
            <li
              style="position: relative"
              @click="openNotificationPopup()"
              v-click-outside="hideNotficationPopup"
            >
              <span class="notification-badge" v-if="numberOfNewNotifications > 0">{{
                numberOfNewNotifications
              }}</span>
              <i class="fa-regular fa-bell"></i>
            </li>
            <li>
              <span
                ><a @click="this.$router.push('/join')">{{
                  $t('userHeader.postProperty')
                }}</a></span
              >
            </li>
            <li v-if="!this.isUserAuthenticated">
              <a @click="this.$router.push('/login')" class="login" style="margin-right: 5px"
                >Đăng ký</a
              >
              <a @click="this.$router.push('/login')" class="login" style="margin-left: 5px"
                >Đăng nhập</a
              >
            </li>
            <li v-if="this.isUserAuthenticated">
              <AccountMenu />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <div class="notification-popup" v-if="isNotificationPopupVisible || haveNewNotifications">
    <div class="notification-header">
      <div class="notification-title">
        <span>Notifications</span>
      </div>
      <div class="mark-all-read-btn">
        <span @click="markAllRead()">Mark all as read</span>
      </div>
    </div>
    <div class="notification-content">
      <div
        class="notification-item"
        v-if="notifications.length == 0"
        style="justify-content: space-around"
      >
        <div class="notification-text">
          <h4>You have no notifications</h4>
        </div>
      </div>
      <div
        class="notification-item"
        v-for="notification in notifications"
        :key="notification.notificationId"
        @click="viewDetails(notification)"
      >
        <div class="notification-icon">
          <i class="fas fa-arrow-up"></i>
        </div>
        <div class="notification-text">
          <h4>
            <i
              class="fa fa-circle"
              aria-hidden="true"
              style="color: red; font-size: 10px"
              v-if="notification.is_read == 0"
            ></i>
            {{ notification.message }}
          </h4>
          <p>2 hrs ago</p>
        </div>
      </div>
    </div>
    <div class="notification-footer">
      <span class="see-all-button">See all</span>
    </div>
  </div>

  <div class="slide" v-if="isSearchOpen">
    <div class="container">
      <div class="inner-wrap" v-if="this.$route.name === 'Home'">
        <strong>{{ $t('userHeader.titleHeader') }}</strong>
        <br />
        <p>{{ $t('userHeader.subtitleHeader') }}</p>
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
          :placeholder="$t('userHeader.locationInputPlaceholder')"
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
              <span>{{ $t('userHeader.guestInputPlaceholder_1') }}</span>
              <div class="counter">
                <button class="decrement" @click="updateGuests('adults', 'decrement')">-</button>
                <span>{{ adults }}</span>
                <button class="increment" @click="updateGuests('adults', 'increment')">+</button>
              </div>
            </div>
            <div class="selector-item">
              <span
                >{{ $t('userHeader.guestInputPlaceholder_2') }} <small>(0 - 17 tuổi)</small></span
              >
              <div class="counter">
                <button class="decrement" @click="updateGuests('children', 'decrement')">-</button>
                <span>{{ children }}</span>
                <button class="increment" @click="updateGuests('children', 'increment')">+</button>
              </div>
            </div>
            <div class="selector-item">
              <span>{{ $t('userHeader.guestInputPlaceholder_3') }}</span>
              <div class="counter">
                <button class="decrement" @click="updateGuests('rooms', 'decrement')">-</button>
                <span>{{ rooms }}</span>
                <button class="increment" @click="updateGuests('rooms', 'increment')">+</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Search button -->
        <button class="search-button" @click="submitSearch">
          {{ $t('userHeader.searchButton') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import flatpickr from 'flatpickr'
import 'flatpickr/dist/flatpickr.css'
import { mapGetters } from 'vuex'
import AccountMenu from './user/AccountMenu.vue'
import LanguageSwitch from './LanguageSwitch.vue'
import socket from '@/services/socket'
import { useToast } from 'vue-toastification'

export default {
  setup() {
    const toast = useToast()
    return {
      toast
    }
  },
  props: {
    isSearchOpen: {
      type: Boolean,
      required: true
    }
  },
  components: {
    AccountMenu,
    LanguageSwitch
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
      showLanguagePopup: false,
      showGuestSelector: false,
      selectedLocation: null,
      dateRange: null,
      adults: 2,
      children: 0,
      rooms: 1,
      checkInDate: null,
      checkOutDate: null,
      numberOfDays: null,
      // notification
      isNotificationPopupVisible: false,
      notifications: [],
      numberOfNewNotifications: 0,
      haveNewNotifications: false
    }
  },
  watch: {
    dateRange(newValue) {
      const dateRegex = /\b(\d{2}\/\d{2}\/\d{4})\b/g
      const dates = newValue.match(dateRegex)

      if (dates) {
        // Convert the date strings to YYYY-MM-DD format
        for (let i = 0; i < dates.length; i++) {
          // Split the string into parts: [DD, MM, YYYY]
          const [day, month, year] = dates[i].split('/')

          // Rearrange into YYYY-MM-DD format
          dates[i] = `${year}-${month}-${day}`
        }

        ;[this.checkInDate, this.checkOutDate] = dates
        // Calculate the number of days between the start and end dates
        this.calculateNumberOfDays(this.checkInDate, this.checkOutDate)
      }
    },
    notifications(newValue) {
      this.calculateNumerOfNewNotifications()
    }
  },
  computed: {
    ...mapGetters('auth', ['isUserAuthenticated', 'getUserRole', 'getUserId']),
    ...mapGetters('search', ['getSearchData']),
    ...mapGetters('user', ['getUserLanguage']),
    guestDetails() {
      return (
        `${this.adults} ` +
        this.$t('userHeader.guestInputPlaceholder_1') +
        ` · ${this.children} ` +
        this.$t('userHeader.guestInputPlaceholder_2') +
        ` · ${this.rooms}` +
        this.$t('userHeader.guestInputPlaceholder_3')
      )
    }
  },
  methods: {
    calculateNumberOfDays(checkInDateString, checkOutDateString) {
      const checkInDate = new Date(checkInDateString)
      const checkOutDate = new Date(checkOutDateString)
      const timeDifference = checkOutDate - checkInDate
      this.numberOfDays = timeDifference / (1000 * 60 * 60 * 24) + 1
    },
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

    openLanguagePopup() {
      this.showLanguagePopup = !this.showLanguagePopup
    },
    closeLanguagePopup() {
      this.showLanguagePopup = false
    },

    async submitSearch() {
      if (!this.selectedLocation || !this.checkInDate || !this.checkOutDate) {
        this.toast.error('Vui lòng chọn địa điểm và ngày bắt đầu và kết thúc')
        return
      }
      const searchData = {
        location: this.selectedLocation,
        checkInDate: this.checkInDate,
        checkOutDate: this.checkOutDate,
        adults: this.adults,
        children: this.children,
        rooms: this.rooms,
        numberOfDays: this.numberOfDays
      }

      // Redirect user to search results page with query params
      this.$router.push({
        name: 'SearchResults',
        query: {
          location: this.selectedLocation,
          checkInDate: this.checkInDate,
          checkOutDate: this.checkOutDate,
          numberOfDays: this.numberOfDays,
          adults: this.adults,
          children: this.children,
          rooms: this.rooms
        }
      })
    },
    joinRoom() {
      if (this.isUserAuthenticated) {
        // Tham gia vào room của admin
        socket.emit('joinUserRoom', this.getUserId)
        // Nhận thông báo mới
        socket.on('newUserNotification', (data) => {
          this.notifications.unshift(data)
          this.numberOfNewNotifications++
          this.haveNewNotifications = true
        })
      } else {
        console.log('User not logged in')
      }
    },
    async getNotifiactions() {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_HOST}/api/notifications`, {
        withCredentials: true
      })
      this.notifications = response.data.notifications
    },
    calculateNumerOfNewNotifications() {
      this.numberOfNewNotifications = 0
      this.notifications.forEach((notification) => {
        if (notification.is_read == 0) {
          this.numberOfNewNotifications++
        }
      })
    },
    async markAllRead() {
      try {
        this.notifications.forEach((notification) => {
          notification.is_read = 1
        })
        this.numberOfNewNotifications = 0

        await axios.get(`${import.meta.env.VITE_SERVER_HOST}/api/notifications/mark-all-as-read`, {
          withCredentials: true
        })
      } catch (error) {
        this.toast.error('Error marking notifications as read')
        console.error(error)
      }
    },
    hideNotficationPopup() {
      this.isNotificationPopupVisible = false
      if (this.haveNewNotifications) {
        this.haveNewNotifications = false
      }
    },
    openNotificationPopup() {
      this.isNotificationPopupVisible = !this.isNotificationPopupVisible
    }
  },
  async mounted() {
    console.log(this.getUserLanguage)
    if (this.isUserAuthenticated) {
      await this.getNotifiactions()
      this.joinRoom()
    }

    if (this.getSearchData) {
      this.selectedLocation = this.getSearchData.location
      if (this.getSearchData.checkInDate && this.getSearchData.checkOutDate) {
        let checkInDate = new Date(this.getSearchData.checkInDate).toLocaleDateString('vi-VN')
        let checkOutDate = new Date(this.getSearchData.checkOutDate).toLocaleDateString('vi-VN')

        if (new Date(this.getSearchData.checkInDate).getTime() < new Date().getTime()) {
          checkInDate = new Date().toLocaleDateString('vi-VN')
        }
        if (new Date(this.getSearchData.checkOutDate).getTime() < new Date().getTime()) {
          checkOutDate = new Date(new Date().getTime() + 1000 * 60 * 60 * 24).toLocaleDateString(
            'vi-VN'
          )
        }

        this.dateRange =
          this.$t('userHeader.dateInputPlaceholder_1') +
          ' ' +
          checkInDate +
          ' ' +
          this.$t('userHeader.dateInputPlaceholder_2') +
          ' ' +
          checkOutDate
      }
      this.children = this.getSearchData.children
      this.adults = this.getSearchData.adults
      this.rooms = this.getSearchData.rooms
      this.numberOfDays = this.getSearchData.numberOfDays
      this.checkInDate = this.getSearchData.checkInDate
      this.checkOutDate = this.getSearchData.checkOutDate
    }

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

.header .inner-login ul li i {
  font-size: 21px;
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
  z-index: 9;
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

.notification-badge {
  padding: 0px 5px;
  position: absolute;
  font-size: 15px;
  background-color: red;
  border-radius: 5px;
  color: #fff;
  top: -5px;
  right: -5px;
}

/* notification header */

.notification-popup {
  position: fixed;
  top: 80px;
  left: 55%;
  /* transform: translateX(10%); */
  width: 350px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  z-index: 9999;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.notification-title {
  font-size: 17px;
  color: #7f8c8d;
  padding: 10px;
}
.mark-all-read-btn {
  color: #3498db;
  font-size: 15px;
  cursor: pointer;
  padding: 10px;
}

.notification-content {
  max-height: 300px;
  overflow-y: auto;
}

.notification-item {
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #f2f2f2;
}

.notification-item:hover {
  background-color: #f2f2f2;
}

.notification-icon {
  margin-right: 12px;
  font-size: 24px;
  position: relative;
  /* color: #00b894; */
}

.notification-text h4 {
  margin: 0 0 4px;
  font-size: 14px;
  font-weight: 600;
}

.notification-text p {
  margin: 0;
  font-size: 12px;
  color: #7f8c8d;
}

.notification-footer {
  padding: 12px;
  text-align: center;
  border-top: 1px solid #f2f2f2;
}

.see-all-button {
  color: #3498db;
  cursor: pointer;
}

.btn {
  display: inline-block;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
  border-radius: 4px;
  transition: all 0.3s ease;
}
</style>
