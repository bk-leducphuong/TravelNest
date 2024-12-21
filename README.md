# Hotel Booking Website

Welcome to the **TravelNest** - Hotel booking website. This platform allows users to book accommodations, post properties, leave reviews, and more. It provides an intuitive interface for guests and property owners, ensuring a seamless booking experience.
This project was inspired by [booking.com](https://booking.com)
> Video demo: [link to video](https://www.youtube.com/watch?v=-jxhmIJp988&list=PLCt2C1YyUqcCfEhqOXE-Mul8UINudlCse)
---

## Features

### For Guests
- **Browse Hotels**: Search and filter hotels by location, price, amenities, and more.
- **Make Reservations**: Book rooms with real-time availability.
- **Review Hotels**: Leave feedback and rate services for hotels you've stayed at.
- **User Dashboard**: Manage bookings and view review history.
- **Post properties**: Allow user post their properties.
- **Switch languages**: Support 2 languages: Vietnamese and English 

### For Hotel Owners
- **List Properties**: Add property details, photos, and room availability.
- **Manage Bookings**: View and manage reservations for your property.
- **Respond to Reviews**: Reply to guest reviews to improve engagement and feedback.
- **Analytics Dashboard**: View booking and review statistics for your property.
- **Switch languages**: Support 2 languages: Vietnamese and English

### AI Integrations (Comming soon...)
- **Sentiment Analysis**: Automatically analyze the sentiment of guest reviews to provide actionable insights for hotel owners.
- **Smart Suggestions**: Recommend hotels to users based on their search preferences and past behavior.

---

## Technologies Used

- **Frontend**: Vuejs
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Cache**: Redis
- **Payment & Payout**: Stripe
- **Map**: Leaflet
- **Authentication**: Session based authentication
- **Mail**: Nodemailer
- **Email validation**: abstractapi
- **SMS**: infobip
- **Realtime notification**: SocketIO
- **AI Features**: 
- **Hosting**: 

---

## Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/bk-leducphuong/Booking-webite.git
   cd hotel-booking-website

## Backend Setup

The backend is built with Node.js and uses MySQL as the database.
### Steps
1. **Install dependencies**
   ```bash
   cd server
   npm install
2. **Set Up the Environment Variables**
3. **Start backend server**
   ```bash
   npm run dev

## Frontend Setup

The frontend is built with Vuejs.
### Steps
1. **Install dependencies**
   ```bash
   cd client
   npm install
2. **Set Up the Environment Variables**
3. **Start backend server**
   ```bash
   npm run dev

## Run stripe webhook
Run in terminal
```bash
stripe listen --forward-to http://localhost:3000/stripe/webhook
```

## Scrape data (for test)
Document comming soon...

