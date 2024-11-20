# Website Server

## Routes

| Category     | HTTP Method |                                   Route |                                                        Description |
| ------------ | :---------- | --------------------------------------: | -----------------------------------------------------------------: |
| Auth         | POST        |                      /api/auth/register |                                               Register a new user. |
| Auth         | POST        |                         /api/auth/login |                                                      Login a user. |
| Auth         | POST        |                        /api/auth/logout |                                                     Logout a user. |
| Auth         | POST        |                    /api/forgot-password |                                                    forgot password |
| Auth         | POST        |                     /api/reset-password |                                                     reset password |
| User         | GET         |            /api/users/me (authenticate) |                                  Get the logged-in user’s profile. |
| User         | PUT         |            /api/users/me (authenticate) |                                               Update user profile. |
| Notification | GET         |       /api/notifications (authenticate) | View the user’s notifications about bookings, payment status, etc. |
| Favorites    | POST        |           /api/favorites (authenticate) |                       Add a hotel to the user’s list of favorites. |
| Favorites    | GET         |           /api/favorites (authenticate) |                                   View the user's favorite hotels. |
| Favorites    | DELETE      |       /api/favorites/:id (authenticate) |                   Remove a specific hotel from the favorites list. |
| Hotels       | GET         |                             /api/hotels |                                          Get a list of all hotels. |
| Hotels       | GET         |                         /api/hotels/:id |                                   Get details of a specific hotel. |
| Reviews      | POST        |  /api/hotels/:id/reviews (authenticate) |                Submit a review for a hotel the user has stayed at. |
| Reviews      | GET         |                 /api/hotels/:id/reviews |                            Retrieve all reviews of specified hotel |
| Reviews      | PUT         |         /api/reviews/:id (authenticate) |                                                      Update review |
| Reviews      | DELETE      |         /api/reviews/:id (authenticate) |                                                      Delete review |
| Hotels       | GET         |                      /api/hotels/search |                             Search hotels by location, dates, etc. |
| Rooms        | GET         |              /api/hotels/:hotelId/rooms |                          Get available rooms for a specific hotel. |
| Rooms        | GET         |                      /api/rooms/:roomId |                                    Get details of a specific room. |
| Bookings     | POST        |            /api/bookings (authenticate) |                                              Create a new booking. |
| Bookings     | GET         |        /api/bookings/:id (authenticate) |                                 Get details of a specific booking. |
| Bookings     | GET         |            /api/bookings (authenticate) |                            Get all bookings of the logged-in user. |
| Bookings     | DELETE      |        /api/bookings/:id (authenticate) |                                                  Cancel a booking. |
| Payments     | POST        |            /api/payments (authenticate) |                                     Process payment for a booking. |
| Payments     | GET         | /api/payments/:bookingId (authenticate) |                        Get payment details for a specific booking. |

## Testing stripe webhook on local

stripe listen --forward-to http://localhost:3000/stripe/webhook
