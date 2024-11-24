<script>
import { mapActions } from 'vuex';

export default {
    name: "DashboardMenu",
    data() {
        return {
          
        }
    },
    methods: {
      ...mapActions ('auth', ['logout'])
    }
}
</script>
<template>
     <nav class="dashboard">
        <div class="logo">BookingVN</div>
        
        <div class="divider"></div>

        <ul class="nav-menu">
          <div class="nav-item-container">
            <div class="title-nav-item active">
              <li class="nav-item" @click="this.$router.push('/admin/home')"><i class="fa fa-home" aria-hidden="true"></i>Home</li>
              <i class="fa fa-angle-right" aria-hidden="true" style="margin-right: 10px;"></i>
            </div>
            <div class="child-item-container">
              <li class="child-item"></li>
            </div>
          </div>
          <div class="nav-item-container">
            <div class="title-nav-item active">
              <li class="nav-item" @click="this.$router.push('/admin/home')"><i class="fa fa-calendar" aria-hidden="true"></i>Availability</li>
              <i class="fa fa-angle-right" aria-hidden="true" style="margin-right: 10px;"></i>
            </div>
            <div class="child-item-container">
              <li class="child-item"></li>
            </div>
          </div>
          <div class="nav-item-container">
            <div class="title-nav-item active">
              <li class="nav-item"><i class="fa fa-list" aria-hidden="true"></i>Bookings</li>
              <i class="fa fa-angle-right" aria-hidden="true" style="margin-right: 10px;"></i>
            </div>
            <div class="child-item-container">
              <li class="child-item" @click="this.$router.push('/admin/bookings/all')">All bookings</li>
              <!-- <li class="child-item" @click="this.$router.push('/admin/payment/invoices')">Invoices</li> -->
            </div>
          </div>
          <div class="nav-item-container">
            <div class="title-nav-item active">
              <li class="nav-item" @click="this.$router.push('/admin/home')"><i class="fa fa-pencil" aria-hidden="true"></i>Property</li>
              <i class="fa fa-angle-right" aria-hidden="true" style="margin-right: 10px;"></i>
            </div>
            <div class="child-item-container">
              <li class="child-item"></li>
            </div>
          </div>
          <div class="nav-item-container">
            <div class="title-nav-item active">
              <li class="nav-item" ><i class="fa fa-credit-card-alt" aria-hidden="true"></i>Payment</li>
              <i class="fa fa-angle-right" aria-hidden="true" style="margin-right: 10px;"></i>
            </div>
            <div class="child-item-container">
              <li class="child-item" @click="this.$router.push('/admin/payment')">Payment methods</li>
              <li class="child-item" @click="this.$router.push('/admin/payment/invoices')">Invoices</li>
            </div>
          </div>
          <div class="nav-item-container">
            <div class="title-nav-item active">
              <li class="nav-item" @click="this.$router.push('/admin/home')"><i class="fa fa-comments" aria-hidden="true"></i>Guest reviews</li>
              <i class="fa fa-angle-right" aria-hidden="true" style="margin-right: 10px;"></i>
            </div>
            <div class="child-item-container">
              <li class="child-item"></li>
            </div>
          </div>
          <div class="nav-item-container">
            <div class="title-nav-item active">
              <li class="nav-item" @click="this.$router.push('/admin/home')"><i class="fa fa-bar-chart" aria-hidden="true"></i>Analytics</li>
              <i class="fa fa-angle-right" aria-hidden="true" style="margin-right: 10px;"></i>
            </div>
            <div class="child-item-container">
              <li class="child-item"></li>
            </div>
          </div>
          <div class="nav-item-container">
            <div class="title-nav-item active">
              <li class="nav-item" @click="this.$router.push('/admin/home')"><i class="fa fa-phone" aria-hidden="true"></i>Support</li>
              <i class="fa fa-angle-right" aria-hidden="true" style="margin-right: 10px;"></i>
            </div>
            <div class="child-item-container">
              <li class="child-item"></li>
            </div>
          </div>
          <div class="nav-item-container">
            <div class="title-nav-item active">
              <li class="nav-item" @click="logout({haveRedirect: true})"><i class="fa fa-sign-out-alt" aria-hidden="true"></i>Logout</li>
            </div>
          </div>
        </ul>
    </nav>
</template>
<style scoped>  
/* Dashboard Sidebar Styles */
.dashboard {
  width: 220px;
  background-color: #1a1f2c;
  color: #ffffff;
  padding: 20px;
  flex-shrink: 0;
}

.logo {
  font-size: 20px;
  font-weight: 600;
  padding: 12px 0;
  margin-bottom: 24px;
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
  color: #94a3b8;
}

.title-nav-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.nav-item.active {
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
  color: #94a3b8;
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