<template>
  <div class="payment-form">
    <form @submit.prevent="handleSubmit">
      <!-- Add email field for receipt -->
      <div class="form-group">
        <label for="email">Email for receipt</label>
        <input 
          type="email" 
          id="email" 
          v-model="email" 
          required 
          class="form-control"
        >
      </div>

      <div id="card-element"></div>
      <div id="card-errors" role="alert"></div>
      
      <!-- Payment Status Message -->
      <div v-if="paymentStatus" :class="['status-message', paymentStatus.type]">
        {{ paymentStatus.message }}
      </div>

      <button type="submit" :disabled="processing">
        {{ processing ? 'Processing...' : 'Pay' }}
      </button>
    </form>
  </div>
</template>

<script>
import { loadStripe } from '@stripe/stripe-js';

export default {
  data() {
    return {
      stripe: null,
      card: null,
      processing: false,
      email: '',
      paymentStatus: null
    }
  },
  async mounted() {
    // Initialize Stripe with your publishable key
    this.stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
    const elements = this.stripe.elements();

    // Create card element
    this.card = elements.create('card');
    this.card.mount('#card-element');

    // Handle real-time validation errors
    this.card.addEventListener('change', (event) => {
      const displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });
  },
  methods: {
    async handleSubmit() {
      try {
        this.processing = true;
        this.paymentStatus = null;
        
        // Create payment method
        const { paymentMethod, error } = await this.stripe.createPaymentMethod({
          type: 'card',
          card: this.card,
        });

        if (error) {
          throw new Error(error.message);
        }

        // Send payment method ID and email to server
        const response = await fetch('http://localhost:3000/api/payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentMethodId: paymentMethod.id,
            amount: 1000, // Amount in cents
            email: this.email, // Include email for receipt
          }),
        });

        const result = await response.json();

        if (result.error) {
          throw new Error(result.error);
        }

        // Handle the result
        if (result.clientSecret) {
          // Confirm the payment with Stripe.js
          const { error: confirmError } = await this.stripe.confirmCardPayment(
            result.clientSecret
          );

          if (confirmError) {
            throw new Error(confirmError.message);
          }

          // Payment successful
          this.paymentStatus = {
            type: 'success',
            message: 'Payment successful! Check your email for confirmation.'
          };

          // Reset form
          this.email = '';
          this.card.clear();
        }
        
      } catch (err) {
        this.paymentStatus = {
          type: 'error',
          message: err.message
        };
      } finally {
        this.processing = false;
      }
    },
  },
  beforeDestroy() {
    if (this.card) {
      this.card.destroy();
    }
  },
}
</script>

<style scoped>
.payment-form {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

#card-element {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 20px;
}

#card-errors {
  color: #dc3545;
  margin-bottom: 10px;
}

.status-message {
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 4px;
}

.status-message.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status-message.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

button {
  width: 100%;
  padding: 10px;
  background: #5469d4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background: #7a8be0;
  cursor: not-allowed;
}
</style>