<script>
import DashboardMenu from '@/components/admin/DashboardMenu.vue'
import AdminHeader from '@/components/admin/AdminHeader.vue'

export default {
  components: {
    DashboardMenu,
    AdminHeader
  }
}
</script>
<template>
  <!-- left dashboard menu-->
  <div class="home-container">
    <DashboardMenu />
    <div class="main-wrapper">
      <!-- top header -->
      <AdminHeader />
      <!-- main content -->
      <div class="main-content">
        <div class="header">
          <h1>Dashboard Overview</h1>
          <div class="header-controls">
            <select>
              <option>Last 30 Days</option>
            </select>
          </div>
        </div>

        <div class="grid">
          <div class="card">
            <h3 class="card-title">Total Booking</h3>
            <div class="booking-num">
              <span class="booking-value">11,230</span>
            </div>
            <div class="room-stats">
              <span>This month : 1913</span>
              <span>This week : 1125</span>
            </div>
          </div>

          <div class="card">
            <h3 class="card-title">Rooms Available</h3>
            <div class="booking-num">
              <span class="booking-value">312</span>
            </div>
            <div class="room-stats">
              <span>Booked(Month) : 912</span>
              <span>Booked(Week) : 125</span>
            </div>
          </div>
        </div>

        <div class="grid">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">New Customer</h3>
            </div>
            <div class="card-content">
              <ul class="customer-list">
                <li class="customer-item">
                  <div class="avatar avatar-ab">AB</div>
                  <div class="customer-info">
                    <div class="customer-name">Abu Bin Ishtiyak</div>
                    <div class="customer-email">info@softinio.com</div>
                  </div>
                  <button class="more-button">⋮</button>
                </li>
                <li class="customer-item">
                  <div class="avatar avatar-sw">SW</div>
                  <div class="customer-info">
                    <div class="customer-name">Sharon Walker</div>
                    <div class="customer-email">sharon-90@example.com</div>
                  </div>
                  <button class="more-button">⋮</button>
                </li>
                <li class="customer-item">
                  <div class="avatar avatar-go">GO</div>
                  <div class="customer-info">
                    <div class="customer-name">Gloria Oliver</div>
                    <div class="customer-email">gloria_72@example.com</div>
                  </div>
                  <button class="more-button">⋮</button>
                </li>
                <li class="customer-item">
                  <div class="avatar">PS</div>
                  <div class="customer-info">
                    <div class="customer-name">Phillip Sullivan</div>
                    <div class="customer-email">phillip-85@example.com</div>
                  </div>
                  <button class="more-button">⋮</button>
                </li>
                <li class="customer-item">
                  <div class="avatar">TI</div>
                  <div class="customer-info">
                    <div class="customer-name">Tasnim Ifrat</div>
                    <div class="customer-email">tasif-85@example.com</div>
                  </div>
                  <button class="more-button">⋮</button>
                </li>
              </ul>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Recent Activities</h3>
              <div class="card-actions"></div>
            </div>
            <div class="card-content">
              <ul class="activity-list">
                <li class="activity-item">
                  <div class="avatar">TM</div>
                  <div class="activity-info">
                    <div class="activity-text">Keith Jensen requested for room.</div>
                    <div class="activity-time">2 hours ago</div>
                  </div>
                </li>
                <li class="activity-item">
                  <div class="avatar">HS</div>
                  <div class="activity-info">
                    <div class="activity-text">Harry Simpson placed a Order.</div>
                    <div class="activity-time">2 hours ago</div>
                  </div>
                </li>
                <li class="activity-item">
                  <div class="avatar">SM</div>
                  <div class="activity-info">
                    <div class="activity-text">Stephanie Marshall cancelled booking.</div>
                    <div class="activity-time">2 hours ago</div>
                  </div>
                </li>
                <li class="activity-item">
                  <div class="avatar">TM</div>
                  <div class="activity-info">
                    <div class="activity-text">Nicholas Carr confirmed booking.</div>
                    <div class="activity-time">2 hours ago</div>
                  </div>
                </li>
                <li class="activity-item">
                  <div class="avatar">TM</div>
                  <div class="activity-info">
                    <div class="activity-text">Timothy Moreno placed a Order.</div>
                    <div class="activity-time">2 hours ago</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.home-container {
  display: flex;
}
/* Main Content Styles */
.main-wrapper {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.notification-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: #f8fafc;
  border-radius: 6px;
  color: #64748b;
  font-size: 14px;
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

.icon-button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-button:hover {
  background-color: #f1f5f9;
}

/* Main content styles updated */
.main-content {
  flex-grow: 1;
  background-color: #f8f9fa;
  padding: 24px;
  overflow-y: auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header h1 {
  font-size: 20px;
  color: #1a1a1a;
}

.header-controls {
  display: flex;
  gap: 12px;
}

select {
  padding: 8px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background-color: white;
  cursor: pointer;
}

.reports-btn {
  padding: 8px 16px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.card {
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card-title {
  color: #64748b;
  font-size: 14px;
  margin-bottom: 10px;
}

.booking-num {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 14px;
}

.booking-value {
  font-size: 24px;
  font-weight: 350;
}

.room-stats {
  display: flex;
  gap: 24px;
  color: #64748b;
  font-size: 14px;
}

.graph-placeholder {
  width: 100%;
  height: 120px;
  background-color: #f1f5f9;
  border-radius: 8px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-actions {
  display: flex;
  gap: 16px;
}

.link-btn {
  color: #3b82f6;
  background: none;
  border: none;
  font-size: 14px;
  cursor: pointer;
}

.cancel-btn {
  color: #64748b;
  background: none;
  border: none;
  font-size: 14px;
  cursor: pointer;
}
.customer-list,
.activity-list {
  list-style: none;
}

.customer-item,
.activity-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
}

.customer-item:last-child,
.activity-item:last-child {
  border-bottom: none;
}

.customer-info,
.activity-info {
  flex-grow: 1;
}

.customer-name,
.activity-text {
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 4px;
}

.customer-email,
.activity-time {
  font-size: 13px;
  color: #64748b;
}

.more-button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
}

.more-button:hover {
  background-color: #f1f5f9;
}

.card-content {
  margin-top: 16px;
}
</style>
