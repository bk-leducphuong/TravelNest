<!-- src/views/Login.vue -->
<template>
    <header class="header">
        <div class="logo">Booking.com</div>
        <div class="header-right">
            <div class="flag"></div>
            <span>?</span>
        </div>
    </header>

    <div class="container" v-if="step === 1">
        <h1>Đăng nhập hoặc tạo tài khoản</h1>
        <p>Bạn có thể đăng nhập tài khoản Booking.com của mình để truy cập các dịch vụ của chúng tôi.</p>
        <form  @submit.prevent="checkEmail">
            <label for="email">Địa chỉ email</label>
            <input type="email" id="email" name="email"  v-model="email" placeholder="Nhập địa chỉ email của bạn" required>
            <button type="submit" class="btn">Tiếp tục với email</button>
        </form>
        <p>hoặc sử dụng một trong các lựa chọn này</p>
        <div class="social-login">
            <button @click="socialLogin('facebook')" class="social-btn" >
                <img src="../assets/icons/facebook.png" alt="Facebook">
            </button>
            <button @click="socialLogin('google')" class="social-btn">
                <img src="../assets/icons/search.png" alt="Google">
            </button>
            <button @click="socialLogin('twitter')" class="social-btn">
                <img src="../assets/icons/twitter.png" alt="Twitter">
            </button>
        </div>
    </div>

    <div class="container" v-if="step === 2">
        <div>
            <h1>{{ isNewUser ? 'Tạo mật khẩu' : 'Nhập mật khẩu của bạn' }}</h1>
            <p>{{ isNewUser ? 'Dùng ít nhất 10 ký tự, trong đó có chữ hoa, chữ thường và số.' : 'Vui lòng nhập mật khẩu Booking.com của bạn cho' }}</p>
        </div>
        <form @submit.prevent="registerOrLogin">
            <div>
                <label for="password">Mật khẩu</label>
                <input type="password" id="password" name="password" placeholder="Nhập mật khẩu" v-model="password" required >
            </div>

            <div v-if="isNewUser">
                <label for="confirm password">Xác nhận mật khẩu</label>
                <input type="password" id="confirm password" name="confirm password" v-model="confirmPassword"  placeholder="Nhập mật khẩu" required>
                <p v-if="passwordMismatch" class="error">Mật khẩu không khớp!</p>
            </div>

            <button type="submit" class="btn" >{{ isNewUser ? 'Tạo tài khoản' : 'Đăng nhập' }}</button>
        </form>
    </div>

    <div class="footer">
            <p>Qua việc đăng nhập hoặc tạo tài khoản, bạn đồng ý với các <a href="#">Điều khoản và Điều kiện</a> cũng như <a href="#">Chính sách An toàn và Bảo mật</a> của chúng tôi</p>
            <p>Bảo lưu mọi quyền.<br>Bản quyền (2006 - 2024) - Booking.com™</p>
    </div>
</template>

<script>
export default {
  data() {
    return {
      step: 1, // Step 1: Email, Step 2: Password
      email: '',
      password: '',
      confirmPassword: '',
      isNewUser: false,
    };
  },
  computed: {
    passwordMismatch() {
        if (this.isNewUser) {
            // Kiểm tra xem password và confirmPassword có giống nhau không
            return this.password !== this.confirmPassword;
        }else {
            return false;
        }
    },
  },
  methods: {
    checkEmail() {
      // Call to API to check if email exists
      fetch('http://localhost:3000/api/auth/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: this.email }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.exists) {
            // Email exists, proceed to login
            this.isNewUser = false;
            
          } else {
            // Email doesn't exist, register new user
            this.isNewUser = true;
          }
          this.step = 2;
        });
    },
    registerOrLogin() {
      if (this.passwordMismatch) {
        return; // Ngăn không cho tiếp tục nếu mật khẩu không khớp
      }
      if (this.isNewUser) {
        // Call API to register new user
        fetch('http://localhost:3000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password
          }),
        })
          .then((response) => response.json())
          .then((data) => {
           if (data.success) {
                if (data.success) {
                    // save data into store
                    this.$store.dispatch('login', { email: this.email, isAuthenticated: true});
                    // redirect to home
                    this.$router.push('/');
                }
            }
          });
      } else {
        // Call API to log in
        fetch('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
                // redirect to home
                this.$router.push('/');
                // save data into store
                this.$store.dispatch('login', { email: this.email, isAuthenticated: true});
            }
          });
      }
    },
    socialLogin(provider) {
      // Handle social login (Facebook, Google, Apple)
      
    },
  },
};
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
