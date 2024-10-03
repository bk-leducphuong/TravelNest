# Website Server 
## Routes
|Category |	HTTP Method	| Route	| Description
|--------|:------|-------:|------:|
|Auth   |POST	| /api/auth/register	| Register a new user.
|Auth	|POST	|/api/auth/login	|Login a user.
|Auth	|POST	|/api/auth/logout	|Logout a user.
|User   |GET    |/api/users/me|	Get the logged-in user’s profile.
|User	|PUT	|/api/users/me	|Update user profile.
|Hotels	|GET	|/api/hotels	|Get a list of all hotels.
|Hotels	|GET	|/api/hotels/:id	|Get details of a specific hotel.
|Hotels	|GET	|/api/hotels/search	|Search hotels by location, dates, etc.
|Rooms	|GET	|/api/hotels/:hotelId/rooms	|Get available rooms for a specific hotel.
|Rooms	|GET	|/api/rooms/:roomId	|Get details of a specific room.
|Bookings	|POST	|/api/bookings	|Create a new booking.
|Bookings	|GET	|/api/bookings/:id|	Get details of a specific booking.
|Bookings	|GET	|/api/bookings	|Get all bookings of the logged-in user.
|Bookings	|DELETE	|/api/bookings/:id	|Cancel a booking.
|Payments	|POST	|/api/payments	|Process payment for a booking.
|Payments	|GET	|/api/payments/:bookingId	|Get payment details for a specific booking.
