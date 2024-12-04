<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import axios from 'axios'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'
import { mapActions } from 'vuex'
import router from '@/router/index.js'

export default {
  components: {
    Header,
    Loading,
    Footer
  },
  data() {
    return {
      bookings: [],
      isLoading: false
    }
  },
  methods: {
    ...mapActions('booking', ['setBookingInformation']),
    async getAllBookings() {
      try {
        this.isLoading = true
        const response = await axios.get('http://localhost:3000/api/booking/get-all-bookings', {
          withCredentials: true
        })
        let bookings = response.data.bookings
        // group bookings which have the same booking code
        this.bookings = this.groupBookings(bookings)
      } catch (error) {
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },
    groupBookings(bookings) {
      const groupedBookings = new Map()

      bookings.forEach((booking) => {
        const bookingCode = booking.booking_code
        const room = {
          roomId: booking.room_id,
          quantity: booking.quantity,
          roomName: booking.roomName
        }
        if (!groupedBookings.has(bookingCode)) {
          groupedBookings.set(bookingCode, {
            booking_code: bookingCode,
            rooms: [room],
            checkInDate: booking.check_in_date,
            checkOutDate: booking.check_out_date,
            bookedOn: booking.created_at,
            hotel: booking.hotel,
            status: booking.status,
            totalPrice: booking.total_price,
            numberOfGuests: booking.number_of_guests
          })
        } else {
          groupedBookings.get(bookingCode).rooms.push(room)
        }
      })

      // Convert Map to an array
      return Array.from(groupedBookings.values())
    }, 
    seeDetails(bookingCode) { 
      this.bookings.forEach(booking => {
        if (booking.booking_code === bookingCode) {
           this.setBookingInformation(booking)
        }
      })
     
      router.push({ name: 'BookingDetails', params: { bookingCode: bookingCode } })
    }
  },
  async mounted() {
    await this.getAllBookings()
  }
}
</script>
<template>
  <Header :isSearchOpen="false" />
  <div class="account-settings">
    <loading v-model:active="isLoading" :color="`#003b95`" :is-full-page="false" />
    <h2 style="font-weight: 700;">Bookings & Trips</h2>
    <br />
    <div class="booking-container" v-for="booking in bookings" :key="booking.booking_id">
      <h3 style="margin-bottom: 5px; font-weight: 700">{{ booking.hotel.city }}</h3>
      <p>
        {{ new Date(booking.checkInDate).toString().split(' ').slice(0, 4).join(' ') }} -
        {{ new Date(booking.checkOutDate).toString().split(' ').slice(0, 4).join(' ') }}
      </p>
      <div class="booking-content-container">
        <div class="section">
          <div class="hotel-image-container">
            <img :src="JSON.parse(booking.hotel.image_urls)[0]" alt="hotel-image" />
          </div>
          <div style="flex: 1; display: flex; justify-content: space-between">
            <div class="content">
              <h2>{{ booking.hotel.name }}</h2>
              <p>
                {{ new Date(booking.checkInDate).toString().split(' ').slice(0, 4).join(' ') }} -
                {{ new Date(booking.checkOutDate).toString().split(' ').slice(0, 4).join(' ') }}
              </p>
              <p>Free cancellation</p>
              <p style="color: green">{{ booking.status }}</p>
              <!-- TODO: add completed -->
            </div>
            <div class="content price-container">
              <h2>VND {{ parseInt(booking.totalPrice).toLocaleString('vi-VN') }}</h2>
              <i class="fa-solid fa-ellipsis-vertical fa-lg"></i>
            </div>
          </div>
        </div>
        <div class="line"></div>
        <div class="see-more-section" @click="seeDetails(booking.booking_code)">
          <i class="fa-solid fa-angle-right fa-xl"></i>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>
<style scoped>
.account-settings {
  position: relative;
  /* max-width: 800px; */
  margin: 0 auto;
  padding: 40px;
  font-family: Arial, sans-serif;
}
.booking-content-container {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  border-radius: 10px;
  margin-bottom: 30px;
}
.section {
  display: flex;
  align-items: initial;
  height: auto;
}

.line {
  width: 100%;
  height: 2px;
  background-color: #e5e7eb;
}

.see-more-section {
  border-radius: 0 0 10px 10px;
  text-align: right;
  padding: 17px;
}

.see-more-section:hover {
  background-color: #f3f3f3;
}

.hotel-image-container {
  width: 110px;
  height: 110px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f2f2f2;
  border-radius: 5px;
  margin-right: 20px;
  margin-left: 10px;
  margin-bottom: 10px;
  margin-top: 10px;
}
.hotel-image-container img {
  border-radius: 10px;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.content h2 {
  font-size: 20px;
  margin-bottom: 10px;
  font-weight: bold;
  margin-top: 10px;
  color: #4c4c4c;
}
.content p {
  color: #666;
  margin: 2px;
}
.content {
  display: flex;
  flex-direction: column;
  text-align: justify;
}

.price-container {
  justify-content: space-between;
  text-align: right;
  margin: 5px;
  margin-right: 20px;
  flex-direction: row !important;
  gap: 20px;
  align-items: center;
}

.manage-link {
  color: #4285f4;
  text-decoration: none;

  padding-bottom: 10px;
}
.manage-link:hover {
  text-decoration: underline;
  margin-bottom: 10px;
}
button {
  background-color: white;
  border: none;
  text-align: right;
  color: #666;
  cursor: pointer;
}

.vl-parent {
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
