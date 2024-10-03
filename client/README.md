# Website Frontend
## Routes
1. **Login** (/login): For logging in users.

   * Component: Login.vue
2. **Register** (/register): For registering new users.

   * Component: Register.vue
3. **Profile** (/profile): Displays and allows updating the logged-in user’s profile.

   * Component: Profile.vue
   * Backend Route: GET /api/users/me, PUT /api/users/me
4. **Hotel List** (/hotels): Displays all hotels.

   * Component: HotelList.vue
   * Backend Route: GET /api/hotels
5. **Hotel Details** (/hotels/:id): Displays specific hotel details.

   * Component: HotelDetails.vue
   * Backend Route: GET /api/hotels/:id
6. **Room Details** (/rooms/:roomId): Displays details of a specific room.

   * Component: RoomDetails.vue
   * Backend Route: GET /api/rooms/:roomId
7. **Bookings** (/bookings): Displays all bookings of the logged-in user.

   * Component: Bookings.vue
   * Backend Route: GET /api/bookings
8. **Booking Details** (/bookings/:id): Displays a specific booking’s details.

   * Component: BookingDetails.vue
   * Backend Route: GET /api/bookings/:id
9. **Payment** (/payments/:bookingId): For processing and viewing payment details for a booking.

   * Component: Payment.vue
   * Backend Route: POST /api/payments, GET /api/payments/:bookingId
10. **Home** (/): Main landing page.
 
     * Component: Home.vue
  
