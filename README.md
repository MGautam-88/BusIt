# Bus Ticket Booking System - MERN Stack

A full-stack bus ticket booking web application built with MongoDB, Express.js, React (Vite), and Node.js.

## 🚌 Features

### User Features
- **User Authentication**: Secure registration and login with JWT
- **Bus Search**: Search buses by source, destination, and date
- **Real-time Availability**: View available seats in real-time
- **Interactive Seat Selection**: Visual seat layout with booked/available status
- **Booking Management**: View, track, and cancel bookings
- **PNR System**: Unique PNR generation for each booking
- **Booking History**: Complete history of all bookings

### System Features
- RESTful API architecture
- Password encryption with bcrypt
- JWT-based authentication
- Real-time seat availability tracking
- Responsive design for all devices


## 📁 Project Structure

```
├── backend/              # Node.js + Express backend
│   ├── models/          # Mongoose models
│   │   ├── User.js     # User model
│   │   ├── Bus.js      # Bus model
│   │   ├── Route.js    # Bus route model
│   │   └── Booking.js  # Booking model
│   ├── routes/          # API routes
│   │   ├── auth.js     # Authentication routes
│   │   ├── users.js    # User routes
│   │   ├── buses.js    # Bus routes
│   │   ├── routes.js   # Bus route routes
│   │   ├── bookings.js # Booking routes
│   │   └── admin.js    # Admin routes
│   ├── controllers/     # Business logic
│   │   └── admin.controller.js  # Admin operations
│   ├── middleware/      # Custom middleware
│   │   ├── auth.js     # Authentication middleware
│   │   └── authorize.js # Authorization middleware
│   ├── server.js        # Entry point
│   └── package.json     # Backend dependencies
│
├── frontend/            # React + Vite frontend (User App)
│   ├── src/
│   │   ├── pages/      # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Home.jsx           # Search page
│   │   │   ├── BusListing.jsx     # Bus search results
│   │   │   ├── SeatSelection.jsx  # Seat booking
│   │   │   ├── MyBookings.jsx     # Booking history
│   │   │   └── Dashboard.jsx      # User profile
│   │   ├── components/ # Reusable components
│   │   ├── services/   # API service layer
│   │   │   └── api.js
│   │   ├── App.jsx     # Main app component
│   │   ├── App.css     # Styles
│   │   └── main.jsx    # Entry point
│   └── package.json    # Frontend dependencies
│
├── frontend-admin/      # React + Vite frontend (Admin Panel)
│   ├── src/
│   │   ├── pages/      # Admin page components
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── BusesManagement.jsx
│   │   │   ├── RoutesManagement.jsx
│   │   │   ├── BookingsManagement.jsx
│   │   │   └── UsersManagement.jsx
│   │   ├── components/ # Admin components
│   │   ├── services/   # API service layer
│   │   └── App.jsx     # Main admin app
│   └── package.json    # Admin frontend dependencies
│
└── README.md
```


## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

### Installation

1. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Install User Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install Admin Frontend Dependencies**
   ```bash
   cd frontend-admin
   npm install
   ```

4. **Configure Environment Variables**
   
   The `.env` file is already created in the backend folder. Update it if needed:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/mern-app
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

   **Important**: Replace `JWT_SECRET` with a secure random string!

## 🎮 Running the Application

### Option 1: Using VS Code Tasks (Recommended)

1. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
2. Type "Tasks: Run Task"
3. Select **"Start Full Stack"** to run both user app servers simultaneously

Or run them separately:
- **"Start Backend Server"** - Runs on http://localhost:5000
- **"Start Frontend Server"** - User app on http://localhost:3000

**To run Admin Panel:**
```bash
cd frontend-admin
npm run dev
```
Admin panel runs on http://localhost:3001

### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - User Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 3 - Admin Frontend (Optional):**
```bash
cd frontend-admin
npm run dev
```

## 📱 Using the Application

1. **Register**: Create a new account with name, email, and password
2. **Login**: Sign in with your credentials
3. **Search Buses**: 
   - Select source and destination cities
   - Choose travel date
   - Click "Search Buses"
4. **Select Seats**:
   - View available buses
   - Click "Select Seats" on preferred bus
   - Choose seats from visual layout
   - Enter passenger details

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users (Protected)
- `GET /api/users/me` - Get current user
- `GET /api/users` - Get all users

### Buses
- `GET /api/buses` - Get all active buses
- `GET /api/buses/:id` - Get bus by ID
- `GET /api/bookings/:id/ticket` - Download PDF ticket

### Admin (Protected - Admin Only)
- `GET /api/admin/buses` - Get all buses
- `POST /api/admin/buses` - Create bus
- `PUT /api/admin/buses/:id` - Update bus
- `DELETE /api/admin/buses/:id` - Delete bus
- `GET /api/admin/routes` - Get all routes
- `POST /api/admin/routes` - Create route
- `PUT /api/admin/routes/:id` - Update route
- `DELETE /api/admin/routes/:id` - Delete route
- `GET /api/admin/bookings` - Get all bookings
- `PUT /api/admin/bookings/:id/cancel` - Cancel any booking
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/role` - Update user role
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/dashboard/stats` - Get dashboard statistics

## 💡 Development

- Backend runs on: http://localhost:5000
- User Frontend runs on: http://localhost:3000
- Admin Frontend runs on: http://localhost:3001
- API proxy configured in Vite for `/api` routes

### Useful Commands

**Backend:**
```bash
npm run dev    # Start development server with nodemon
npm start      # Start production server
## 💡 Development

- Backend runs on: http://localhost:5000
- Frontend runs on: http://localhost:3000
- API proxy configured in Vite for `/api` routes

### Useful Commands

**Backend:**
```bash
npm run dev    # Start development server with nodemon
npm start      # Start production server
npm run seed   # Populate database with sample data
```

**Frontend:**
```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run preview # Preview production build
```

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM (Object Data Modeling)
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **PDFKit** - PDF ticket generation

### Frontend (User & Admin)
- **React 18** - UI library
- **Vite** - Build tool & dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

## 🎯 Admin Panel Features

### Admin Authentication
- Separate admin login at http://localhost:3001
- Role-based access control (admin, super_admin)
- Protected admin routes

### Admin Capabilities
- **Dashboard**: View system statistics (users, buses, routes, bookings, revenue)
- **Bus Management**: Create, edit, delete buses
- **Route Management**: Create, edit, delete routes with pricing
- **Booking Management**: View all bookings, cancel bookings (releases seats)
- **User Management**: View users, change roles, delete users

## 🎯 Features to Add (Future Enhancements)

- [ ] Payment gateway integration
- [x] Email notifications for bookings
- [ ] SMS alerts
- [ ] Multiple passenger booking in one transaction
- [ ] Seat type preferences (window/aisle)
- [ ] Discount coupons and offers
- [x] Admin panel for bus/route management
- [ ] Rating and review system
- [ ] Refund management
- [ ] Bus tracking (real-time location)
- [ ] Multi-language support
- [x] PDF ticket generation

## 📝 Notes

- Make sure MongoDB is running before starting the backend
- The `.env` file contains sensitive information - never commit it to version control
- Frontend proxy configuration forwards `/api` requests to the backend
- Default seat layout is 4 seats per row with automatic aisle spacing
- A🚀 Quick Start for New Users

1. **Clone and Install**
   ```bash
   # Install all dependencies
   cd backend && npm install
   cd ../frontend && npm install
   cd ../frontend-admin && npm install
   ```

2. **Setup MongoDB**
   - Start MongoDB locally or use MongoDB Atlas
   - Update `MONGODB_URI` in backend/.env

3. **Create Admin User**
   ```javascript
   // In MongoDB shell or Compass:
   db.users.insertOne({
     name: "Admin",
     email: "admin@busticket.com",
     password: "$2a$10$...", // Use bcrypt to hash password
     role: "admin",
     createdAt: new Date()
   })
   ```

4. **Run Application**
   ```bash
   # Terminal 1: Backend
   cd backend && npm run dev
   
   # Terminal 2: User Frontend
   cd frontend && npm run dev
   
   # Terminal 3: Admin Panel (Optional)
   cd frontend-admin && npm run dev
   ```

5. **Access Applications**
   - User App: http://localhost:3000
   - Admin Panel: http://localhost:3001
   - Backend API: http://localhost:5000

## dmin users must have `role: "admin"` or `role: "super_admin"` in database
- Console logs are removed from browser (frontend) for production readiness
- Backend server logs are preserved for monitoring and debugging

## 🐛 Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is installed and running
- Check if `MONGODB_URI` in `.env` is correct
- For MongoDB Atlas, ensure your IP is whitelisted

**Port Already in Use:**
- Change `PORT` in backend `.env` file
- Update proxy in frontend `vite.config.js` if you change the backend port
- Admin panel uses port 3001 by default

**Booking Seats Already Taken:**
- The app checks seat availability in real-time
- If you see this error, refresh the seat selection page

**Admin Login Fails:**
- Ensure user has `role: "admin"` or `role: "super_admin"` in database
- Check MongoDB: `db.users.findOne({email: "admin@example.com"})`
- Update role: `db.users.updateOne({email: "admin@example.com"}, {$set: {role: "admin"}})`
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **Axios** - HTTP client

## Development

- Backend runs on: http://localhost:5000
- Frontend runs on: http://localhost:3000
- API proxy configured in Vite for `/api` routes

## Default Features

1. **User Registration**: Create new accounts with name, email, password
2. **User Login**: Authenticate with email and password
3. **Dashboard**: View user profile and list of all users
4. **Logout**: Clear session and return to login

## Next Steps

- Add more models and routes as needed
- Implement additional features (e.g., user profiles, posts, etc.)
- Add form validation
- Implement error boundaries
- Add loading states
- Deploy to production (Heroku, Vercel, etc.)

## Notes

- Make sure MongoDB is running before starting the backend
- The `.env` file contains sensitive information - never commit it to version control
- Frontend proxy configuration forwards `/api` requests to the backend

## License

MIT
#   B u s I t  
 