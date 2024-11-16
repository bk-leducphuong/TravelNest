<script>
import AdminHeader from '@/components/admin/AdminHeader.vue'

export default {
  components: {
    AdminHeader
  }
}
</script>
<template>
  <AdminHeader />
  <main class="main-content">
    <div class="welcome-section">
      <div class="profile-circle"></div>
      <div>
        <h1>Welcome!</h1>
        <p>We're happy to have Flat in Kallithea as a partner.</p>
      </div>
    </div>

    <div class="warning-message">
      Guests can't make bookings at your property yet.
      <br />
      To start receiving guests, just follow the steps below.
    </div>

    <div class="steps-container">
      <div class="step-card">
        <div class="step-number">1</div>
        <h3>Take our guided tour</h3>
        <p>Follow us as we guide you through the most important features of your Extranet.</p>
        <a href="#" class="button">Start guided tour</a>
      </div>

      <div class="step-card">
        <div class="step-number">2</div>
        <h3>Update your calendar</h3>
        <p>Bookings you receive are instant. Avoid overbookings by updating your calendar.</p>
        <a href="#" class="button">Update calendar</a>
      </div>

      <div class="step-card">
        <div class="step-number">3</div>
        <h3>Get online and bookable</h3>
        <p>and start getting reservations</p>
        <a href="#" class="button primary">Go online and bookable now!</a>
      </div>
    </div>

    <div class="property-details">
      <h2>Property Details</h2>
      <p>
        Add more photos: Quality photos showcase all your space has to offer, plus they attract
        potential guests!
      </p>
    </div>
  </main>
</template>
<style scoped>
.main-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.profile-circle {
  width: 80px;
  height: 80px;
  background-color: #eee;
  border-radius: 50%;
}

.steps-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.step-card {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.step-number {
  background-color: #e74c3c;
  color: white;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin: 0 auto 1rem;
}

.button {
  display: inline-block;
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-decoration: none;
  color: #666;
  margin-top: 1rem;
}

.button.primary {
  background-color: #0071c2;
  color: white;
  border: none;
}

.property-details {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.warning-message {
  background-color: #fff3cd;
  border: 1px solid #ffeeba;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
}
</style>
