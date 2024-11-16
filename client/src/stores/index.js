// store/index.js
import { createStore } from 'vuex';
import VuexPersistence from 'vuex-persist';

import auth from './auth';
import user from './user';
import search from './search';
import book from './book';
import join from './join';

const vuexSession = new VuexPersistence({
  storage: window.sessionStorage,
  modules: ['search', 'book'],
});

export default createStore({
  modules: {
    auth,
    user,
    search,
    book,
    join
  },
  plugins: [vuexSession.plugin],
});