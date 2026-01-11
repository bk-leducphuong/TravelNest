<script>
  import LanguageSwitch from './LanguageSwitch.vue';
  import { mapGetters } from 'vuex';
  export default {
    components: {
      LanguageSwitch,
    },
    props: {
      isAdminLogin: {
        type: Boolean,
        required: true,
      },
    },
    data() {
      return {
        showLanguagePopup: false,
      };
    },
    computed: {
      ...mapGetters('user', ['getUserLanguage']),
    },
    methods: {
      closeLanguagePopup() {
        this.showLanguagePopup = false;
      },
      openLanguagePopup() {
        this.showLanguagePopup = !this.showLanguagePopup;
      },
    },
  };
</script>
<template>
  <LanguageSwitch @close-language-popup="closeLanguagePopup" v-if="showLanguagePopup" />
  <div class="header-container">
    <div class="inner-wrap">
      <div class="inner-logo">
        <strong><a @click="this.$router.push('/')">TravelNest</a></strong>
      </div>
      <div class="inner-login">
        <ul>
          <li><strong>VND</strong></li>
          <li @click="openLanguagePopup()">
            <img
              :src="`https://flagcdn.com/w40/${getUserLanguage.split('-')[1].toLowerCase()}.png`"
              style="width: 20px; height: 20px; cursor: pointer"
              alt="Vietnam"
            />
          </li>
          <li><i class="fa-regular fa-circle-question"></i></li>
          <li v-if="isAdminLogin"><span>Đã là đối tác ?</span></li>
          <li v-if="isAdminLogin" class="login" v-on:click="this.$router.push('/admin/login')">
            Đăng nhập
          </li>
          <li class="guides">Trợ giúp</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import '@/assets/styles/index.scss';

.header-container {
  padding: 0 $spacing-xl;
  background-color: $primary-color;

  .inner-wrap {
    @include flex-between;
    padding: 12px 0;
  }

  .inner-logo strong {
    font-size: $font-size-lg;
    color: $white;
  }

  .inner-login ul {
    @include flex-between;
    color: $white;
    list-style-type: none;
    margin-bottom: 0;

    li {
      padding: $spacing-sm;
      margin-left: $spacing-md;
      border-radius: $border-radius-md;
      @include flex-center;
      font-size: $font-size-sm;
      cursor: pointer;
      transition: background-color 0.2s ease;

      &:hover {
        background-color: $primary-color-dark;
      }

      img {
        border-radius: 50%;
        height: 18px;
        overflow: hidden;
        width: auto;
      }

      span {
        font-weight: 600;
      }
    }

    .login,
    .guides {
      padding: $spacing-xs $spacing-sm;
      color: $secondary-color;
      font-weight: 500;
      background-color: $white;
      border-radius: $border-radius-md;
      transition: background-color 0.2s ease;

      &:hover {
        background-color: $background-light;
      }
    }
  }
}
</style>
