<!-- src/views/Login.vue -->
<template>
    <div class="container">
        <div class="login-box">
            <h2>Đăng nhập hoặc tạo tài khoản</h2>
            <div class="input-group">
                <label for="email">Địa chỉ email</label>
                <input type="email" id="email" placeholder="Nhập địa chỉ email của bạn">
            </div>
            <button class="btn-primary">Tiếp tục với email</button>
            <div class="divider">
                <span>hoặc sử dụng một trong các lựa chọn này</span>
            </div>
            <div class="social-login">
                <button class="social-btn facebook">Facebook</button>
                <button class="social-btn google">Google</button>
                <button class="social-btn apple">Apple</button>
            </div>
            <p class="terms">
                Qua việc đăng nhập hoặc tạo tài khoản, bạn đồng ý với các <a href="#">Điều khoản</a> và <a href="#">Chính sách An toàn và Bảo mật</a> của chúng tôi.
            </p>
        </div>
    </div>

  <!-- <div class="login-container">
    <h1>Login</h1>
    <form @submit.prevent="submitLogin">
      <div class="form-group">
        <label for="email">Email:</label>
        <input v-model="email" type="email" id="email" required />
      </div>
      
      <div class="form-group">
        <label for="password">Password:</label>
        <input v-model="password" type="password" id="password" required />
      </div>

      <button type="submit">Login</button>
    </form>
  </div> -->
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    submitLogin() {
      // Perform login logic (you can call your backend API here)
      if (this.email && this.password) {
        alert(`Logging in with ${this.email}`);
        // You can use Vuex or emit events to handle login here.
      }
    }
  }
};
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: Arial, sans-serif;
}

body {
    background-color: #f0f0f0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.container {
    width: 100%;
    max-width: 500px;
    padding: 20px;
}

.login-box {
    background-color: white;
    border-radius: 10px;
    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
    padding: 40px;
    text-align: center;
}

h2 {
    color: #003580;
    font-size: 24px;
    margin-bottom: 20px;
}

.input-group {
    margin-bottom: 20px;
}

label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

input {
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    font-size: 16px;
}

.btn-primary {
    background-color: #0071c2;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    width: 100%;
}

.btn-primary:hover {
    background-color: #005fa3;
}

.divider {
    margin: 20px 0;
    color: #666;
    font-size: 14px;
}

.social-login {
    display: flex;
    justify-content: space-between;
}

.social-btn {
    width: 30%;
    padding: 10px;
    border-radius: 5px;
    font-size: 14px;
    cursor: pointer;
}

.facebook {
    background-color: #4267B2;
    color: white;
}

.google {
    background-color: #DB4437;
    color: white;
}

.apple {
    background-color: #000;
    color: white;
}

.terms {
    margin-top: 20px;
    color: #666;
    font-size: 12px;
}

.terms a {
    color: #0071c2;
    text-decoration: none;
}

.terms a:hover {
    text-decoration: underline;
}

</style>
