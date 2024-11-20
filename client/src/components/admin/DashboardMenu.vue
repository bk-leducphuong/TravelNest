<script>
export default {
    name: "DashboardMenu",
    data() {
        return {

        }
    }
}
</script>
<template>
     <nav class="dashboard">
        <div class="logo">BookingVN</div>
        
        <div class="divider"></div>

        <ul class="nav-menu">
            <li class="nav-item active" @click="this.$router.push('/admin/home')">Dashboard</li>
            <li class="nav-item">Bookings</li>
            <li class="nav-item">Room</li>
            <li class="nav-item">Reports</li>
            <li class="nav-item">Customers</li>
            <li class="nav-item" @click="this.$router.push('/admin/payment')">Payment</li>
            <li class="nav-item">Support</li>
            <li class="nav-item">Settings</li>
        </ul>
    </nav>
</template>
<style scoped>  
/* Dashboard Sidebar Styles */
.dashboard {
  width: 260px;
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

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.nav-item.active {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.divider {
  height: 1px;
  background-color: #2d3748;
  margin: 20px 0;
}
</style>