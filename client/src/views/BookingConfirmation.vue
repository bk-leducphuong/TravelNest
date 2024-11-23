<script>
import axios from 'axios'
export default {
  data() {
    return {
      bookingInformation: null
    }
  },
  methods: {
    async getBookingInformation() {
      const response = await axios.post(
        'http://localhost:3000/api/user/booking/get-booking-information',
        {
          bookingCode: this.$route.query.bookingCode
        },
        { withCredentials: true }
      )

      this.bookingInformation = response.data.bookingInformation
      // console.log(response.data)
    }
  },
  async mounted() {
    await this.getBookingInformation()
  }
}
</script>
<template>
  <!-- header  -->
  <div class="header">
    <div class="" style="padding: 0px 20px;">
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
    <div class="success-card">
      <div class="success-header">
        <div class="success-icon">✓</div>
        <h1 class="success-title">Your booking is confirmed!</h1>
        <p v-if="bookingInformation">Booking ID: {{ bookingInformation.booking_code }}</p>
      </div>

      <div class="booking-details">
        <div class="detail-section">
          <h2 class="section-title">Hotel Information</h2>
          <div class="detail-grid">
            <div class="detail-item">
              <div class="detail-label">Hotel Name</div>
              <div class="detail-value">Luxury Beach Resort & Spa</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Room Type</div>
              <div class="detail-value">Deluxe Ocean View</div>
            </div>
          </div>
        </div>

        <div class="detail-section">
          <h2 class="section-title">Stay Details</h2>
          <div class="detail-grid">
            <div class="detail-item">
              <div class="detail-label">Check-in</div>
              <div class="detail-value">Monday, Dec 20, 2024 (from 14:00)</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Check-out</div>
              <div class="detail-value">Thursday, Dec 23, 2024 (until 12:00)</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Length of Stay</div>
              <div class="detail-value">3 nights</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Guests</div>
              <div class="detail-value">2 Adults</div>
            </div>
          </div>
        </div>

        <div class="detail-section">
          <h2 class="section-title">Price Summary</h2>
          <div class="price-summary">
            <div class="price-row">
              <span>Room Rate (3 nights)</span>
              <span>$450.00</span>
            </div>
            <div class="price-row">
              <span>Taxes & Fees</span>
              <span>$45.00</span>
            </div>
            <div class="price-row total-row">
              <span>Total Amount Paid</span>
              <span>$495.00</span>
            </div>
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <a href="#" class="btn btn-primary">View Booking Details</a>
        <a href="#" class="btn btn-secondary">Download Receipt</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* header  */
.header{
  background-color: #003B95 ;
  margin-bottom: 35px;
}

.header .inner-wrap{
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  align-items: center;
}

.header .inner-logo strong{
  font-size: 24px;
  color: #fff;
}

.header .inner-login ul {
  display: flex;
  color: #fff;
  list-style-type:none ;
  align-items: center;
  margin-bottom: 0;
}

.header .inner-login ul li{
  padding: 10px;
  margin-left: 15px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
}

.header .inner-login ul li:hover{
  background-color: #1A4FA0;
}

.header .inner-login ul li img{
  border-radius: 50%;
  height: 18px;
  overflow: hidden;
  width: auto;
}
.header .inner-login ul li span{
  font-weight: 600;
}

.header .inner-login ul .login {
  padding: 5px 10px;
  color:  #1d5fc2;
  font-weight: 500;
  background-color: #fff;
  border-radius: 5px;
}
.header .inner-login ul .guides {
  padding: 5px 10px;
  color:  #1d5fc2;
  font-weight: 500;
  background-color: #fff;
  border-radius: 5px;
}

.header .inner-login ul .login:hover{
  background-color: #f0f6fde8;
}
.header .inner-login ul .guides:hover {
  background-color: #f0f6fde8;
}
/* end header  */
.container {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
}

.success-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.success-header {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.success-icon {
  color: #4caf50;
  font-size: 48px;
  margin-bottom: 20px;
}

.success-title {
  color: #4caf50;
  font-size: 24px;
  margin-bottom: 10px;
}

.booking-details {
  margin-top: 30px;
}

.detail-section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #2962ff;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.detail-item {
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
}

.detail-label {
  font-weight: bold;
  color: #666;
  font-size: 14px;
}

.detail-value {
  color: #333;
  margin-top: 5px;
}

.price-summary {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 4px;
  margin-top: 20px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.total-row {
  border-top: 2px solid #ddd;
  margin-top: 10px;
  padding-top: 10px;
  font-weight: bold;
}

.action-buttons {
  display: flex;
  gap: 15px;
  margin-top: 30px;
  justify-content: center;
}

.btn {
  padding: 12px 25px;
  border-radius: 4px;
  border: none;
  font-size: 16px;
  cursor: pointer;
  text-decoration: none;
  text-align: center;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #2962ff;
  color: white;
}

.btn-secondary {
  background-color: #fff;
  color: #2962ff;
  border: 1px solid #2962ff;
}

.btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
