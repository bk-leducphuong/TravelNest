<!-- src/views/Login.vue -->
<template>
  <ForgotPassword :email="email" :userRole="userRole" @close="closeForgotPassword" v-if="isForgotPassword"/>
  <LoginHeader :isAdminLogin="false" />
  <div class="container" v-if="step === 1">
    <h1>{{ $t('loginHeader') }}</h1>
    <p>
      Bạn có thể đăng nhập tài khoản Booking.com của mình để truy cập các dịch vụ của chúng tôi.
    </p>
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
      <h1>{{ isNewUser ? 'Tạo mật khẩu' : 'Nhập mật khẩu của bạn' }}</h1>
      <p>
        {{
          isNewUser
            ? 'Dùng ít nhất 8 ký tự, trong đó có chữ hoa, chữ thường, số'
            : 'Vui lòng nhập mật khẩu Booking.com của bạn cho'
        }}
      </p>
    </div>
    <form @submit.prevent="registerOrLogin">
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
      <div class="forgot-password" @click="isForgotPassword = true" v-if="!isNewUser">Forgot password?</div>

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
        <p v-if="passwordMismatch" style="color: red;" class="error">Mật khẩu không khớp!</p>
      </div>

      <button type="submit" class="btn">{{ isNewUser ? 'Tạo tài khoản' : 'Đăng nhập' }}</button>
    </form>
  </div>

  <div class="footer">
    <p>
      Qua việc đăng nhập hoặc tạo tài khoản, bạn đồng ý với các
      <a  >Điều khoản và Điều kiện</a> cũng như
      <a  >Chính sách An toàn và Bảo mật</a> của chúng tôi
    </p>
    <p>Bảo lưu mọi quyền.<br />Bản quyền (2006 - 2024) - Booking.com™</p>
  </div>
</template>

<script>
import axios from 'axios' // Import Axios
import { mapActions, mapGetters } from 'vuex'
import { useToast } from "vue-toastification";
import ForgotPassword from '@/components/ForgotPassword.vue';
import user from '@/stores/user';
import checkPasswordStrength from '@/utils/checkPasswordStrength';
import LoginHeader from '@/components/LoginHeader.vue'

export default {
  components: {
    ForgotPassword,
    LoginHeader
  },
  setup() {
      // Get toast interface
      const toast = useToast();
      // Make it available inside methods
      return { toast }
  },
  data() {
    return {
      step: 1, // Step 1: Email, Step 2: Password
      email: '',
      password: '',
      confirmPassword: '',
      isNewUser: false,
      isForgotPassword: false,
      userRole: 'customer'
    }
  },
  computed: {
    ...mapGetters('auth', ['isLoginFail']),
    passwordMismatch() {
      return this.isNewUser && this.password !== this.confirmPassword
    }
  },
  methods: {
    ...mapActions('auth', ['login']), // Map the login action

    checkEmail() {
      // Call to API to check if email exists
      axios
        .post('http://localhost:3000/api/auth/check-email', {
          email: this.email,
          userRole: this.userRole
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
      if (this.passwordMismatch) {
        return // Prevent proceeding if passwords do not match
      }

      if (this.isNewUser) {
        const strength = checkPasswordStrength(this.password);
        if (strength < 4) {
          this.toast.error('Password is too weak. Please use a stronger password.')
          return
        }
      }

      const apiUrl = this.isNewUser
        ? 'http://localhost:3000/api/auth/register'
        : 'http://localhost:3000/api/auth/login'

      const payload = this.isNewUser
        ? { email: this.email, password: this.password, userRole: this.userRole}
        : { email: this.email, password: this.password, userRole: this.userRole }

      await this.login({ apiUrl: apiUrl, payload: payload, redirectRoute: this.$route.query.redirect || '/'})
      if (this.isLoginFail) {
        this.toast.error('Mật khẩu sai!')
        this.password = ''
      }
    },
    async socialLogin(provider) {
      // Ensure `provider` is one of the allowed providers
      const allowedProviders = ['facebook', 'google', 'apple']
      if (!allowedProviders.includes(provider)) {
        console.error('Invalid provider')
        return
      }

      // Show loading state (could be a UI change, like a spinner)
      this.isLoading = true

      try {
        const queryUrl = `http://localhost:3000/api/auth/login-${provider}`
        const response = await axios.get(queryUrl, { withCredentials: true })

        if (response.data.success) {
          this.$router.push('/')
          this.toast.success('Successfully logged in!') // Example for user feedback
        } else {
          this.toast.error('Login failed. Please try again.')
        }
      } catch (error) {
        console.error('Error during social login:', error)
        this.toast.error('An error occurred during login. Please try again.')
      } finally {
        this.isLoading = false // Remove loading state
      }
    },
    closeForgotPassword() {
      this.isForgotPassword = false
    }
  }
}
</script>

<style scoped>
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

.forgot-password {
  font-size: 16px;
  color: #2966e8;
  margin-bottom: 15px;
  cursor: pointer;
  text-align: right;
}

.forgot-password:hover {
  color: #004779;
}
</style>
