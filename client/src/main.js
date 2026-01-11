import './assets/main.css';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import stores from './stores/index.js'; // import store
import { clickOutside } from '../directives/clickOutsite'; // import custom directives
import i18n from './config/i18n';
import Toast from 'vue-toastification';
// Import the CSS or use your own!
import 'vue-toastification/dist/index.css';
import 'leaflet';
import './assets/styles/index.scss';

const app = createApp(App);

// add custom directives
app.directive('click-outside', clickOutside);

// Add i18n to the app instance
app.use(i18n);
app.use(stores);
app.use(router);

// toast notification
const options = {
  //...
};

app.use(Toast, options);

app.mount('#app');
