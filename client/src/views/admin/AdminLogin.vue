<!-- src/views/Login.vue -->
<template>
  <header class="header">
    <div class="logo"><a href="/">Booking.com</a></div>
    <div class="header-right">
      <div class="flag"></div>
      <span>?</span>
    </div>
  </header>

  <div class="container" v-if="step === 1">
    <h4>{{ $t('loginHeader') }}</h4>
    <p>Nhập email để trở thành đối tác của chúng tôi</p>
    <form @submit.prevent="checkEmail">
      <label for="email">Địa chỉ email</label>
      <input
        type="email"
        id="email"
        name="email"
        v-model="email"
        placeholder="Nhập địa chỉ email của bạn"
        required
      />

      <button type="submit" class="btn">Tiếp tục với email</button>
    </form>
    <p>hoặc sử dụng một trong các lựa chọn này</p>
    <div class="social-login">
      <button @click="socialLogin('facebook')" class="social-btn">
        <img src="../assets/icons/facebook.png" alt="Facebook" />
      </button>
      <button @click="socialLogin('google')" class="social-btn">
        <img src="../assets/icons/search.png" alt="Google" />
      </button>
      <button @click="socialLogin('twitter')" class="social-btn">
        <img src="../assets/icons/twitter.png" alt="Twitter" />
      </button>
    </div>
  </div>

  <div class="container" v-if="step === 2">
    <div>
      <h4>
        {{ isNewUser ? 'Hãy điền các thông tin để hoàn thiện đăng kí' : 'Nhập mật khẩu của bạn' }}
      </h4>
      <p>
        {{
          isNewUser
            ? 'Mật khẩu phải có ít nhất 10 ký tự, trong đó có chữ hoa, chữ thường và số.'
            : 'Vui lòng nhập mật khẩu Booking.com của bạn cho'
        }}
      </p>
    </div>
    <form @submit.prevent="submitSecondForm">
      <div v-if="isNewUser">
        <label for="password">Tên</label>
        <input type="text" placeholder="Nhập tên của bạn" v-model="firstName" required />
      </div>
      <div v-if="isNewUser">
        <label for="password">Họ</label>
        <input type="text" placeholder="Nhập họ của bạn" v-model="lastName" required />
      </div>
      <div v-if="isNewUser">
        <label for="password">Số điện thoại</label>
        <input
          type="text"
          placeholder="Nhập số điện thoại của bạn"
          v-model="phoneNumber"
          required
        />
      </div>
      <div>
        <label for="password">Mật khẩu</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Nhập mật khẩu"
          v-model="password"
          required
        />
      </div>

      <div v-if="isNewUser">
        <label for="confirm password">Xác nhận mật khẩu</label>
        <input
          type="password"
          id="confirm password"
          name="confirm password"
          v-model="confirmPassword"
          placeholder="Nhập mật khẩu"
          required
        />
        <p v-if="passwordMismatch" class="error" style="color: red;">Mật khẩu không khớp!</p>
      </div>

      <button type="submit" class="btn">{{ isNewUser ? 'Tạo tài khoản' : 'Đăng nhập' }}</button>
    </form>
  </div>

  <div class="footer">
    <p>
      Qua việc đăng nhập hoặc tạo tài khoản, bạn đồng ý với các
      <a href="#">Điều khoản và Điều kiện</a> cũng như
      <a href="#">Chính sách An toàn và Bảo mật</a> của chúng tôi
    </p>
    <p>Bảo lưu mọi quyền.<br />Bản quyền (2006 - 2024) - Booking.com™</p>
  </div>

  <OtpVerification
    v-if="openVerificationPopup"
    :phone-number="phoneNumber"
    @update-is-verified="updateIsVerified"
  />
</template>

<script>
import axios from 'axios' // Import Axios
import { mapActions, mapGetters } from 'vuex'
import { useToast } from 'vue-toastification'
import OtpVerification from '@/components/admin/otp-verification/OtpVerification.vue'

export default {
  components: {
    OtpVerification
  },
  setup() {
    // Get toast interface
    const toast = useToast()
    // Make it available inside methods
    return { toast }
  },
  data() {
    return {
      step: 1, // Step 1: Email, Step 2: Password
      email: '',
      password: '',
      // for new user
      lastName: '',
      firstName: '',
      phoneNumber: '',
      confirmPassword: '',
      isNewUser: false,

      // for OTP verification
      isVerified: false,
      openVerificationPopup: false
    }
  },
  computed: {
    ...mapGetters('auth', ['isAuthenticated', 'getOtp']),
    passwordMismatch() {
      return this.isNewUser && this.password !== this.confirmPassword
    }
  },
  methods: {
    ...mapActions('auth', ['loginAdmin', 'logout', 'sendOtp']), // Map the login action,
    updateIsVerified(status) {
      this.isVerified = status
      if (status) {
        this.registerOrLogin()
      }else {
        this.toast.error('OTP verification failed!')
        this.$router.push('/admin/login')
      }
    },
    checkEmail() {
      // Call to API to check if email exists
      axios
        .post('http://localhost:3000/api/auth/check-email', {
          email: this.email,
          userRole: 'partner'
        })
        .then((response) => {
          if (response.data.exists) {
            // Email exists, proceed to login
            this.isNewUser = false
          } else {
            // Email doesn't exist, register new user
            this.isNewUser = true
          }
          this.step = 2
        })
        .catch((error) => {
          if (error.response && error.response.status === 400) {
            const errorMessage = error.response.data.message || 'Invalid input!'
            this.toast.error(`Error: ${errorMessage}`)
          } else {
            this.toast.error('Unexpected error occurred. Please try again.')
          }
        })
    },
    async registerOrLogin() {
      // logout as a customer before starting with admin
      if (this.isAuthenticated) {
        await this.logout({ haveRedirect: false })
      }
      const apiUrl = this.isNewUser
        ? 'http://localhost:3000/api/auth/admin/register'
        : 'http://localhost:3000/api/auth/admin/login'
      const payload = this.isNewUser
        ? {
            email: this.email,
            password: this.password,
            userRole: 'partner',
            firstName: this.firstName,
            lastName: this.lastName,
            phoneNumber: this.phoneNumber
          }
        : { email: this.email, password: this.password, userRole: 'partner' }
      await this.loginAdmin({
        apiUrl: apiUrl,
        payload: payload
      })
    },
    async runOtpVerification() {
      try {
        // send OTP
        await this.sendOtp({ phoneNumber: this.phoneNumber })
        if (this.getOtp) {
          this.toast.success('OTP đã được gửi đến điện thoại của bạn!')
        } else {
          this.toast.error('Không thể gửi OTP đến điện thoại của bạn!')
        }

        // open otp verification popup
        this.openVerificationPopup = true
      } catch (error) {
        console.error('Error during OTP verification:', error)
      }
    },
    submitSecondForm() {
      this.isNewUser ? this.runOtpVerification() : this.registerOrLogin()
    }
  }
}
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: white;
}
.header {
  background-color: #003580;
  color: white;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logo {
  font-weight: bold;
  font-size: 24px;
}
.header-right {
  display: flex;
  align-items: center;
}
.flag {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #ff0000;
  display: inline-block;
  margin-right: 10px;
}
.container {
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
  background-color: white;
  border-radius: 4px;
}
h1 {
  color: #333;
  margin-bottom: 20px;
}
p {
  color: #666;
  line-height: 1.5;
}
input {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.btn {
  width: 100%;
  padding: 10px;
  background-color: #0071c2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}
.social-login {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
.social-btn {
  width: 30%;
  height: 40px;
  border: 1px solid #ccc;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.social-btn img {
  width: 20px;
  height: 20px;
}
.footer {
  text-align: center;
  margin-top: 20px;
  font-size: 12px;
  color: #666;
}
.footer a {
  color: #0071c2;
  text-decoration: none;
}
</style>
