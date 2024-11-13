export default {
  namespaced: true,
  state: {
    joinFormData: {
      // form 1
      streetName: null,
      zipCode: null,
      city: null,

      // form 2
      coordinates: null,

      // form 3
      services: [],

      // form 4
      hotelName: null,
      rating: null,

      // form 5
      checkInFrom: null,
      checkInTo: null,
      checkOutFrom: null,
      checkOutTo: null,
      haveChildren: null,
      havePet: null,
    },
  },
  mutations: {
    setJoinFormData(state, { formData, step }) {
      // Ensure the mutation modifies the joinFormData object within state
      switch (step) {
        case 1:
          state.joinFormData.streetName = formData.streetName;
          state.joinFormData.zipCode = formData.zipCode;
          state.joinFormData.city = formData.city;
          break;
        case 2:
          state.joinFormData.coordinates = formData.coordinates;
          break;
        case 3:
          state.joinFormData.services = formData.services;
          break;
        case 4:
          state.joinFormData.hotelName = formData.hotelName;
          state.joinFormData.rating = formData.rating;
          break;
        case 5:
          state.joinFormData.checkInFrom = formData.checkInFrom;
          state.joinFormData.checkInTo = formData.checkInTo;
          state.joinFormData.checkOutFrom = formData.checkOutFrom;
          state.joinFormData.checkOutTo = formData.checkOutTo;
          state.joinFormData.haveChildren = formData.haveChildren;
          state.joinFormData.havePet = formData.havePet;
          break;
      }
    },
  },
  actions: {
    collectFormData({ commit }, payload) {
      commit('setJoinFormData', payload);
    },
  },
  getters: {
    getJoinFormData(state) {
      return state.joinFormData;
    },
  },
};

