<script>
import socket from '@/services/socket'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      haveNewNotification: false
    }
  },
  methods: {
    showNotificationIcon() {}
  },
  computed: {
    ...mapGetters('auth', ['getUserId'])
  },
  mounted() {
    if (this.getUserId) {
      // Tham gia vào room của admin
      socket.emit('joinRoom', this.getUserId)
      // Nhận thông báo mới
      socket.on('newNotification', (data) => {
        // console.log('New notification received:', data)
        // {type: 'payment', message: 'Bạn có một đơn đặt phòng mới.'}
        // Cập nhật giao diện hiển thị thông báo
        this.haveNewNotification = true
      })
    } else {
      console.log('User not logged in')
    }
  }
}
</script>
<template>
  <header class="top-header">
    <div class="header-container">
      <!-- account  -->
      <div class="header-right">
        <div class="user-profile">
          <div class="avatar">T</div>
          <span>Thanh</span>
        </div>
      </div>
      <!-- notification popup -->
      <div class="notification-container">
        <div class="notification-icon">
          <i class="fa fa-bell" aria-hidden="true"></i>
          <i
            v-if="haveNewNotification"
            class="fa fa-circle"
            aria-hidden="true"
            style="color: red; font-size: 10px; float: right"
          ></i>
        </div>
        <div class="notification-popup">
          <div class="notification-header">
            <div class="notification-title">
              <span>Notifications</span>
            </div>
            <div class="mark-all-read-btn">
              <span>Mark all as read</span>
            </div>
          </div>
          <div class="notification-content">
            <div class="notification-item">
              <div class="notification-icon">
                <i class="fas fa-arrow-up"></i>
              </div>
              <div class="notification-text">
                <h4>You have requested to Withdraw</h4>
                <p>2 hrs ago</p>
              </div>
            </div>
            <div class="notification-item">
              <div class="notification-icon">
                <i class="fas fa-arrow-down"></i>
              </div>
              <div class="notification-text">
                <h4>Your Deposit Order is placed</h4>
                <p>2 hrs ago</p>
              </div>
            </div>
            <div class="notification-item">
              <div class="notification-icon">
                <i class="fas fa-arrow-up"></i>
              </div>
              <div class="notification-text">
                <h4>You have requested to Withdraw</h4>
                <p>2 hrs ago</p>
              </div>
            </div>
          </div>
          <div class="notification-footer">
            <span class="see-all-button">See all</span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
<style scoped>
.top-header {
  height: 64px;
  background-color: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  /* justify-content: space-between; */
  align-items: center;
  padding: 0 24px;
}

.header-container {
  position: absolute;
  right: 15px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  margin-right: 12px;
  flex-shrink: 0;
  background-color: gray;
}

/* notification */
.notification-icon {
  cursor: pointer;
}
.notification-popup {
  position: fixed;
  top: 80px;
  right: 20px;
  width: 350px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  z-index: 9999;
}

/* notification header */
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
  display: flex;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #f2f2f2;
}

.notification-icon {
  margin-right: 12px;
  font-size: 20px;
  color: #00b894;
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

.btn-primary {
  background-color: #3498db;
  color: #fff;
  border: none;
}

.btn-primary:hover {
  background-color: #2980b9;
}
</style>
