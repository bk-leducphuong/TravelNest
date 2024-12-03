<script>
import Footer from '@/components/Footer.vue';
import Header from '@/components/Header.vue'
export default {
  components: {
    Header,
    Footer
  }
}
</script>
<template>
  <Header :isSearchOpen="false" />
  <div class="confirmation-container">
    <h1 class="greeting">Thanks, Adnan!</h1>
    <h2 class="confirmation-title">Your booking in Islamabad is confirmed.</h2>
    <ul class="details-list">
      <li>
        <span class="icon">✔</span> We sent your confirmation email to
        <strong>adnan75500@hotmail.com</strong> <a href="#" class="edit-link">Edit</a>
      </li>
      <li>
        <span class="icon">✔</span> <a href="#" class="highlight-link">Get a better room</a> for
        just PKR 1,721.26
      </li>
      <li>
        <span class="icon">✔</span> Your <strong>payment</strong> will be handled by
        <strong>Chalet Islamabad</strong>. The <strong>Price</strong> section below has more
        details.
      </li>
      <li>
        <span class="icon">✔</span> Get paperless confirmation when you
        <a href="#" class="highlight-link">download the app</a>
      </li>
      <li>
        <span class="icon">✔</span> <strong>PKR 1,898 Credits</strong> will be added to your
        <a href="#" class="highlight-link">Wallet</a> 14 days after your stay.
      </li>
    </ul>
    <div class="button-container">
      <button class="button print-btn">Print confirmation</button>
      <button class="button save-btn">Save confirmation to phone</button>
    </div>
  </div>
  <h1 class="section-title">Check Your Details</h1>
  <div class="details-container">
    <!-- Left Section -->
    <div class="details-left">
      <div class="property-details">
        <h2 class="property-name">Chalet Islamabad <span class="badge">Genius</span></h2>
        <p class="rating">★★★★★</p>
        <p><strong>Confirmation number:</strong> 2998.711.171</p>
        <p><strong>PIN Code:</strong> 4338 <span class="lock-icon">🔒</span></p>
        <h3 class="subheading">Booking Details</h3>
        <p>2 nights, 1 selected <a href="#" class="action-link">Add space for more guests</a></p>
        <p><strong>You booked for:</strong> 1 adult</p>
        <p><strong>Check-in:</strong> Sunday, October 1, 2023 (12:00 PM - 12:00 AM)</p>
        <p><strong>Check-out:</strong> Tuesday, October 3, 2023 (12:00 PM - 1:00 PM)</p>
        <div class="calendar-links">
          <a href="#" class="calendar-link">Outlook/iCal</a>
          <a href="#" class="calendar-link">Google calendar</a>
        </div>
      </div>
    </div>

    <!-- Right Section -->
    <div class="details-right">
      <h2 class="subheading">Is everything correct?</h2>
      <p class="note">
        You can always view or change your booking online – no registration required.
      </p>
      <ul class="action-list">
        <li><a href="#" class="action-link">❌ Cancel your booking</a></li>
        <li><a href="#" class="action-link">Edit guest details</a></li>
        <li><a href="#" class="action-link">Message property</a></li>
        <li><a href="#" class="action-link">Change dates</a></li>
        <li><a href="#" class="action-link">Change your room</a></li>
      </ul>
    </div>
  </div>
  <Footer />
</template>
<style scoped>
.confirmation-container {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 50px 50px;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.greeting {
  color: #333;
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.confirmation-title {
  color: #000;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 20px;
}

.details-list {
  list-style: none;
  margin-bottom: 20px;
}

.details-list li {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.icon {
  color: #4caf50;
  font-weight: bold;
  margin-right: 10px;
}

.edit-link {
  font-size: 0.9rem;
  margin-left: 10px;
  color: #007bff;
  text-decoration: none;
}

.highlight-link {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}

.highlight-link:hover {
  text-decoration: underline;
}

.button-container {
  display: flex;
  gap: 10px;
}

.button {
  border: none;
  padding: 10px 15px;
  font-size: 1rem;
  color: #fff;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.3s ease;
}

.print-btn {
  background-color: #0056b3;
}

.save-btn {
  background-color: #007bff;
}

.button:hover {
  opacity: 0.9;
}

/* Container */
.details-container {
  display: flex;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin: 50px 50px;
}

/* Left Section */
.details-left {
  flex: 3;
  padding: 20px;
  border-right: 1px solid #ddd;
}

.section-title {
    margin-left: 50px;
  font-size: 1.5rem;
  margin-bottom: 15px;
}

.property-name {
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 5px;
}

.badge {
  background-color: #007bff;
  color: #fff;
  font-size: 0.8rem;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 8px;
}

.rating {
  color: #fbc02d;
  margin-bottom: 15px;
}

.subheading {
  font-size: 1.1rem;
  font-weight: bold;
  margin: 20px 0 10px;
}

.lock-icon {
  color: #4caf50;
  font-size: 0.9rem;
}

.calendar-links {
  margin-top: 10px;
}

.calendar-link {
  font-size: 0.9rem;
  color: #007bff;
  text-decoration: none;
  margin-right: 15px;
}

.calendar-link:hover {
  text-decoration: underline;
}

.action-link {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}

.action-link:hover {
  text-decoration: underline;
}

/* Right Section */
.details-right {
  flex: 2;
  padding: 20px;
}

.note {
  font-size: 0.9rem;
  margin: 10px 0 20px;
}

.action-list {
  list-style: none;
}

.action-list li {
  margin-bottom: 10px;
}
</style>
