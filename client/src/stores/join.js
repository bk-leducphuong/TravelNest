export default {
  namespaced: true,
  state: {
    joinFormData: {
      // form 1
      streetName: null,
      zipCode: null,
      city: null,

      // form 2
      coordinates: {
        latitude: 23.12312, // test values
        longitude: 123.12312,
      },

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

      // form 6
      roomDetails: {
        roomType: null,
        numberOfRooms: 0,
        numberOfGuests: 0,
        roomArea: 0,
        allowSmoke: null
      },
      bedOptions: [
        {
          index: 0,
          name: 'Giường đơn',
          width: '90 - 130',
          quantity: 0
        },
        {
          index: 1,
          name: 'Giường đôi',
          width: '131 - 150',
          quantity: 0
        },
        {
          index: 2,
          name: 'Giường lớn (cỡ King)',
          width: '151 - 180',
          quantity: 0
        },
        {
          index: 3,
          name: 'Giường cực lớn (cỡ Super-King)',
          width: '181 - 210',
          quantity: 0
        }
      ],
      imagePreviews: [], // Array to store preview URLs
      imageFiles: [],

      haveOnlinePayment: false,
      haveOfflinePayment: false,

      onlinePaymentMethodInfor: {
        cardNumber: null,
        cardHolderName: null,
        expiryDate: null,
        CVC: null
      }
    },
  },
  mutations: {
    
  },
  actions: {
    
  },
  getters: {
    getJoinFormData(state) {
      return state.joinFormData;
    },
  },
};

