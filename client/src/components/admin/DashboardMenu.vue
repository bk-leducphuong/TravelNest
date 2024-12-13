<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    name: "DashboardMenu",
    data() {
        return {
          isHomeSelected: false,
          isPaymentSelected: false,
          isBookingsSelected: false,
          isRoomAvailabilitySelected: false,
          isReviewSelected: false,
          isRoomSelected: false,
          selected: false
        }
    },
    computed: {
      ...mapGetters('manageHotels', ['getCurrentManagingHotelId']),
      hotelId() {
        return this.getCurrentManagingHotelId
      }
    },
    methods: {
      ...mapActions ('auth', ['logout']),
    },
    mounted() {
      this.isHomeSelected = true 
    }
}
</script>
<template>
     <div class="dashboard-container">
      <nav class="dashboard">
        <div class="logo" @click="this.$router.push('/admin/hotels-management')">Booking.com</div>

        <ul class="nav-menu">
          <!-- Home -->
          <div class="nav-item-container">
            <div class="title-nav-item" >
              <li class="nav-item" @click="this.$router.push(`/admin/${hotelId}/home`)"><i class="fa fa-home" aria-hidden="true"></i>Home</li> 
            </div>
          </div>
          <!-- Availability -->
          <div class="nav-item-container">
            <div class="title-nav-item" @click="this.isRoomAvailabilitySelected = !this.isRoomAvailabilitySelected">
              <li class="nav-item"><i class="fa fa-calendar" aria-hidden="true"></i>Availability</li>
              <i class="fa fa-angle-right" aria-hidden="true" style="margin-right: 10px;" v-if="!this.isRoomAvailabilitySelected"></i>
              <i class="fa fa-angle-down" aria-hidden="true" style="margin-right: 10px;" v-if="this.isRoomAvailabilitySelected"></i>
            </div>
            <div class="child-item-container" v-if="this.isRoomAvailabilitySelected">
              <li class="child-item">
                <li class="child-item" @click="this.$router.push(`/admin/${hotelId}/room-availability/availability-calendar`)">Availability calendar</li>
              </li>
            </div>
          </div>
          <!-- Bookings -->
          <div class="nav-item-container">
            <div class="title-nav-item" @click="this.isBookingsSelected = !this.isBookingsSelected">
              <li class="nav-item"><i class="fa fa-list" aria-hidden="true"></i>Bookings</li>
              <i class="fa fa-angle-right" aria-hidden="true" style="margin-right: 10px;" v-if="!this.isBookingsSelected"></i>
              <i class="fa fa-angle-down" aria-hidden="true" style="margin-right: 10px;" v-if="this.isBookingsSelected"></i>
            </div>
            <div class="child-item-container" v-if="this.isBookingsSelected">
              <li class="child-item" @click="this.$router.push(`/admin/${hotelId}/bookings/all`)">All bookings</li>
              <!-- <li class="child-item" @click="this.$router.push('/admin/payment/invoices')">Invoices</li> -->
            </div>
          </div>
          <!-- Property -->
          <div class="nav-item-container">
            <div class="title-nav-item" @click="this.isRoomSelected = !this.isRoomSelected">
              <li class="nav-item" ><i class="fa fa-pencil" aria-hidden="true"></i>Property</li>
              <i class="fa fa-angle-right" aria-hidden="true" style="margin-right: 10px;" v-if="!this.isRoomSelected"></i>
              <i class="fa fa-angle-down" aria-hidden="true" style="margin-right: 10px;" v-if="this.isRoomSelected"></i>
            </div>
            <div class="child-item-container" v-if="this.isRoomSelected">
              <li class="child-item" @click="this.$router.push(`/admin/${hotelId}/room/room-details`)">Room details</li>
              <li class="child-item" @click="this.$router.push(`/admin/${hotelId}/room/room-photos`)">Room photos</li>
              <li class="child-item" @click="this.$router.push(`/admin/${hotelId}/room/room-amenities`)">Room amenities</li>
              <li class="child-item" @click="this.$router.push(`/admin/${hotelId}/room/room-details`)">Policies</li>
              <li class="child-item" @click="this.$router.push(`/admin/${hotelId}/room/room-details`)">Room services</li>
            </div>
          </div>
          <!-- Payment -->
          <div class="nav-item-container">
            <div class="title-nav-item" @click="this.isPaymentSelected = !this.isPaymentSelected">
              <li class="nav-item" ><i class="fa fa-credit-card-alt" aria-hidden="true"></i>Payment</li>
              <i class="fa fa-angle-right" aria-hidden="true" style="margin-right: 10px;" v-if="!this.isPaymentSelected"></i>
              <i class="fa fa-angle-down" aria-hidden="true" style="margin-right: 10px;" v-if="this.isPaymentSelected"></i>
            </div>
            <div class="child-item-container" v-if="this.isPaymentSelected">
              <li class="child-item" @click="this.$router.push(`/admin/${hotelId}/payment`)">Payment methods</li>
              <!-- <li class="child-item" @click="this.$router.push(`/admin/${hotelId}/payment/stripe-connect-account-management`)">Stripe management</li> -->
               <li class="child-item"><a href="https://connect.stripe.com/express_login" target="_blank">Stripe management</a></li>
              <li class="child-item" @click="this.$router.push(`/admin/${hotelId}/payment/invoices`)">Invoices</li>
            </div>
          </div>
          <!-- Guest reviews -->
          <div class="nav-item-container">
            <div class="title-nav-item">
              <li class="nav-item" @click="this.isReviewSelected = !this.isReviewSelected"><i class="fa fa-comments" aria-hidden="true"></i>Guest reviews</li>
              <i class="fa fa-angle-right" aria-hidden="true" style="margin-right: 10px;" v-if="!this.isReviewSelected"></i>
              <i class="fa fa-angle-down" aria-hidden="true" style="margin-right: 10px;" v-if="this.isReviewSelected"></i>
            </div>
            <div class="child-item-container" v-if="this.isReviewSelected">
              <li class="child-item" @click="this.$router.push(`/admin/${hotelId}/review/guest-reviews`)">Guest reviews</li>
              <li class="child-item" @click="this.$router.push(`/admin/${hotelId}/review/guest-experiences`)">Guest experiences</li>
            </div>
          </div>
          <!-- Analytics -->
          <div class="nav-item-container">
            <div class="title-nav-item  ">
              <li class="nav-item" @click="this.$router.push('/admin/home')"><i class="fa fa-bar-chart" aria-hidden="true"></i>Analytics</li>
              <i class="fa fa-angle-right" aria-hidden="true" style="margin-right: 10px;" v-if="!this.selected"></i>
              <i class="fa fa-angle-down" aria-hidden="true" style="margin-right: 10px;" v-if="this.selected"></i>
            </div>
            <div class="child-item-container">
              <li class="child-item"></li>
            </div>
          </div>
          <!-- Support -->
          <div class="nav-item-container">
            <div class="title-nav-item  ">
              <li class="nav-item" @click="this.$router.push('/admin/home')"><i class="fa fa-phone" aria-hidden="true"></i>Support</li>
            </div>
            <div class="child-item-container">
              <li class="child-item"></li>
            </div>
          </div>
          <!-- Logout -->
          <div class="nav-item-container">
            <div class="title-nav-item  ">
              <li class="nav-item" @click="logout({haveRedirect: true})"><i class="fa fa-sign-out-alt" aria-hidden="true"></i>Logout</li>
            </div>
          </div>
        </ul>
    </nav>
 </div>
</template>
<style scoped>  
/* Dashboard Sidebar Styles */
.dashboard-container {
  /* height: 100vh; */
  width: 220px;
  padding: 0px 20px;
  flex-shrink: 0;
  background-color: #003b95;
  color: #ffffff;
  
}
.dashboard {
  position: fixed;
  height: 100vh;
  overflow-y: scroll;
  background-color: #003b95;
  /* height: 100%; */
}

.dashboard::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Edge */
}

.logo {
  font-size: 25px;
  font-weight: 700;
  padding: 12px 0;
  text-align: center;
  cursor: pointer;
}

.nav-menu {
  list-style: none;
  padding: 0px;
}

.nav-item-container {
  margin-top: 7px;
}

.nav-item {
  padding: 12px;
  margin-bottom: 4px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
}

.title-nav-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.active {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.title-nav-item {
  display: flex;
  justify-content: space-between;
  text-align: center;
  align-items: center;
  border-radius: 10px;
  cursor: pointer;
}

.child-item-container {
  margin-left: 41px;
  display: flex;
  justify-content: space-between;
  /* align-items: center; */
  flex-direction: column;
  gap: 10px;
}

.child-item {
  cursor: pointer;
  font-size: 14px;
  color: white;
}

.child-item:hover {
  color: #496392;
}

.divider {
  height: 1px;
  background-color: #2d3748;
  margin: 20px 0;
}
</style>