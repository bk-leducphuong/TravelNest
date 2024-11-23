<template>
  <div id="payment-status">
    <div id="status-icon">
      <i class="fa-solid fa-check-circle-check"></i>
    </div>
    <h2>Your booking is complete!</h2>
    <p>Thank you for booking with Booking.com. We'll send you a confirmation email shortly.</p>
    <a id="view-details" href="http://localhost:5173/book/details">View Details</a>
    <button id="retry-button" @click="this.$router.push('/book')">Retry</button>
  </div>
</template>
<style scoped>
#payment-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}

#status-icon {
  font-size: 100px;
  color: #003b95;
}

#view-details {
  background-color: #003b95;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

#retry-button {
  background-color: #003b95;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

</style>