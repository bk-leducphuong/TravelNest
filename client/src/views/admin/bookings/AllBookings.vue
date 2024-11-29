<script>
import axios from 'axios'
import DashboardMenu from '@/components/admin/DashboardMenu.vue'
import AdminHeader from '@/components/admin/AdminHeader.vue'
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      bookings: []
    }
  },
  computed: {
    ...mapGetters('manageHotels', ['getCurrentManagingHotelId'])
  },
  methods: {
    async getAllBookings() {
      const response = await axios.post('http://localhost:3000/api/admin/bookings/all', {
        hotelId: this.getCurrentManagingHotelId
      }, {
        withCredentials: true
      })
      this.bookings = response.data.bookings
      for (let i = 0; i < this.bookings.length; i++) {
        this.bookings[i].bookerInformation = await this.getBookerInformation(this.bookings[i].buyer_id)
      }
    },
    async getBookerInformation(buyer_id) {
      const response = await axios.post('http://localhost:3000/api/admin/bookings/get-booker-information', {
        buyer_id: buyer_id
      }, {
        withCredentials: true
      })
      return response.data.bookerInformation
    },
  },
  async mounted() {
    await this.getAllBookings()
  },
  components: {
    DashboardMenu,
    AdminHeader
  }
}
</script>
<template>
  <div class="all-bookings-container">
    <DashboardMenu />
    <div class="main-wrapper">
      <!-- top header -->
      <AdminHeader />
      <!-- main content -->
      <div class="main-content">
        <div class="container">
          <div class="header">
            <div>
              <h1>Booking Lists</h1>
              <div class="booking-count">You have total {{ bookings.length }} bookings.</div>
            </div>
            <div class="actions">
              <button class="export-btn">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Export
              </button>
              <button class="add-btn">+</button>
            </div>
          </div>

          <div class="actions">
            <select class="bulk-action">
              <option>Bulk Action</option>
            </select>
            <button class="bulk-action">Apply</button>
          </div>

          <table>
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>ID</th>
                <th>Customer</th>
                <th>Package</th>
                <th>Booking</th>
                <th>Room Type</th>
                <th>Arrive</th>
                <th>Payment</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="booking in bookings" :key="booking.booking_id">
                <td><input type="checkbox" /></td>
                <td>{{ booking.booking_code.slice(0, 5) + '...' }}</td>
                <td>
                  <div class="customer-info">
                    <div>
                      <div class="customer-name">{{ booking.bookerInformation.username }}</div>
                      <div class="customer-email">{{ booking.bookerInformation.email }}</div>
                    </div>
                  </div>
                </td>
                <td>Continental</td>
                <td><span class="status active">Active</span></td>
                <td>Super Delux</td>
                <td>10 Feb 2020</td>
                <td><span class="status active">Paid</span></td>
                <td><button class="more-btn">⋮</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.all-bookings-container {
  display: flex;
}
/* Main Content Styles */
.main-wrapper {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.main-content {
  padding: 24px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header h1 {
  color: #2d3748;
  font-size: 24px;
  font-weight: 600;
}

.booking-count {
  color: #718096;
  font-size: 16px;
  margin-top: 8px;
}

.actions {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.bulk-action {
  padding: 8px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  color: #718096;
  cursor: pointer;
}

.export-btn {
  padding: 8px 16px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  color: #4a5568;
  display: flex;
  align-items: center;
  gap: 8px;
}

.add-btn {
  padding: 8px 16px;
  background: #6366f1;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  text-align: left;
  padding: 12px;
  color: #718096;
  font-weight: 500;
  border-bottom: 1px solid #e2e8f0;
}

td {
  padding: 12px;
  border-bottom: 1px solid #e2e8f0;
}

.customer-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 500;
}

.avatar.blue {
  background: #6366f1;
}

.avatar.yellow {
  background: #ecc94b;
}

.avatar.navy {
  background: #2c5282;
}

.customer-name {
  font-weight: 500;
  color: #2d3748;
}

.customer-email {
  color: #718096;
  font-size: 14px;
}

.status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
}

.status.active {
  background: #c6f6d5;
  color: #38a169;
}

.status.pending {
  background: #fefcbf;
  color: #d69e2e;
}

.more-btn {
  background: none;
  border: none;
  color: #718096;
  cursor: pointer;
  font-size: 20px;
}
</style>
