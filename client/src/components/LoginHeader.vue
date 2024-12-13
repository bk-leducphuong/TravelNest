<script>
import LanguageSwitch from './LanguageSwitch.vue'
import { mapGetters } from 'vuex'
export default {
  components: {
    LanguageSwitch
  },
  props: {
    isAdminLogin: {
        type: Boolean,
        required: true
    }
  },
  data() {
    return {
      showLanguagePopup: false
    }
  },
  computed: {
    ...mapGetters('user', ['getUserLanguage'])
  },
  methods: {
    closeLanguagePopup() {
      this.showLanguagePopup = false
    },
    openLanguagePopup() {
      this.showLanguagePopup = !this.showLanguagePopup
    }
  }
}
</script>
<template>
  <LanguageSwitch @close-language-popup="closeLanguagePopup" v-if="showLanguagePopup" />
  <div class="header-container">
      <div class="inner-wrap">
        <div class="inner-logo">
          <strong><a @click="this.$router.push('/')">Booking.com</a></strong>
        </div>
        <div class="inner-login">
          <ul>
            <li><strong>VND</strong></li>
            <li @click="openLanguagePopup()">
              <img
                :src="`https://flagcdn.com/w40/${getUserLanguage.split('-')[1].toLowerCase()}.png`"
                style="width: 20px; height: 20px; cursor: pointer;"
                alt="Vietnam"
              />
            </li>
            <li><i class="fa-regular fa-circle-question"></i></li>
            <li v-if="isAdminLogin"><span>Đã là đối tác ?</span></li>
            <li v-if="isAdminLogin" class="login" v-on:click="this.$router.push('/admin/login')">Đăng nhập</li>
            <li class="guides">Trợ giúp</li>
          </ul>
        </div>
      </div>
  </div>
</template>
<style scoped>
/* header-container  */
.header-container {
    padding: 0px 25px;
    background-color: #003b95;
}

.header-container .inner-wrap {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  align-items: center;
}

.header-container .inner-logo strong {
  font-size: 24px;
  color: #fff;
}

.header-container .inner-login ul {
  display: flex;
  color: #fff;
  list-style-type: none;
  align-items: center;
  margin-bottom: 0;
}

.header-container .inner-login ul li {
  padding: 10px;
  margin-left: 15px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  font-size: 14px;
  cursor: pointer;
}

.header-container .inner-login ul li:hover {
  background-color: #1a4fa0;
}

.header-container .inner-login ul li img {
  border-radius: 50%;
  height: 18px;
  overflow: hidden;
  width: auto;
}
.header-container .inner-login ul li span {
  font-weight: 600;
}

.header-container .inner-login ul .login {
  padding: 5px 10px;
  color: #1d5fc2;
  font-weight: 500;
  background-color: #fff;
  border-radius: 5px;
}
.login {
  cursor: pointer;
}
.guides {
  cursor: pointer;
}

.header-container .inner-login ul .guides {
  padding: 5px 10px;
  color: #1d5fc2;
  font-weight: 500;
  background-color: #fff;
  border-radius: 5px;
}

.header-container .inner-login ul .login:hover {
  background-color: #f0f6fde8;
}
.header-container .inner-login ul .guides:hover {
  background-color: #f0f6fde8;
}
/* end header-container  */
</style>
