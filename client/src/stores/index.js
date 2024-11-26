// store/index.js
import { createStore } from 'vuex';
import VuexPersistence from 'vuex-persist';

import auth from './auth';
import user from './user';
import search from './search';
import book from './book';
import join from './join';
// admin
import manageHotels from './manageHotels';

const vuexSession = new VuexPersistence({
  storage: window.sessionStorage,
  reducer: (state) => ({
    // Persist the entire `search` and `book` modules
    search: state.search,
    book: state.book,
  }),
});

const stores = createStore({
  modules: {
    auth,
    user,
    search,
    book,
    join,
    manageHotels,
  },
  plugins: [vuexSession.plugin],
});

export default stores
  