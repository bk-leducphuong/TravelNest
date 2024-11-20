<template>
  <div class="return-page">
    <h1>Welcome Back!</h1>
    <p>Your Stripe account setup is complete. You can now start using the platform.</p>
    <button @click="goToDashboard">Go to Dashboard</button>
  </div>
</template>

<script>
export default {
  methods: {
    goToDashboard() {
      this.$router.push('/admin/home'); // Replace with your desired route
    },
  },
};
</script>

<style scoped>
.return-page {
  text-align: center;
  margin-top: 100px;
}
button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #218838;
}
</style>
