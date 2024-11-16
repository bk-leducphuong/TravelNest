<template>
  <nav class="navbar">
    <div class="logo">Booking.com</div>
  </nav>

  <div class="menu-bar">
    <a href="#" class="menu-item">🏠 Home</a>
    <a href="#" class="menu-item">📅 Rates & Availability</a>
    <a href="#" class="menu-item">📋 Reservations</a>
    <a href="#" class="menu-item">🔑 Property</a>
    <a href="#" class="menu-item">🚀 Opportunities</a>
    <a href="#" class="menu-item">✉️ Inbox</a>
    <a href="#" class="menu-item">⭐ Guest Reviews</a>
    <a href="#" class="menu-item">💰 Finance</a>
    <a href="#" class="menu-item">📊 Analytics</a>
  </div>
</template>
<style scoped>
.navbar {
  background-color: #003580;
  padding: 1rem;
  color: white;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.menu-bar {
  background-color: #003580;
  padding: 0.5rem;
  display: flex;
  gap: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.menu-item {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}
</style>
