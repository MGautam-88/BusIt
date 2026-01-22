# 🚍 BusIt — Bus Ticket Booking System (MERN)

A full‑stack bus ticket booking web application built with MongoDB, Express, React (Vite), and Node.js.

---

## 📚 Table of Contents

- [✨ Features](#-features)
- [🗂️ Project structure](#-project-structure)
- [⚙️ Prerequisites](#-prerequisites)
- [⬇️ Installation](#-installation)
- [🔐 Environment variables](#-environment-variables)
- [▶️ Running the application](#️-running-the-application)
- [🧭 Using the application](#-using-the-application)
- [🔌 API endpoints](#-api-endpoints)
- [🛠️ Admin panel features](#-admin-panel-features)
- [🖼️ Screenshots](#-screenshots)
- [💻 Development & useful commands](#-development--useful-commands)
- [🚀 Future enhancements](#-future-enhancements)
- [🐞 Troubleshooting](#-troubleshooting)
- [📄 License](#-license)

---

## ✨ Features

### 👥 User features
- 🔐 Secure registration and login with JWT
- 🔎 Search buses by source, destination and date
- ⚡ Real-time seat availability
- 🪑 Interactive seat selection (visual layout)
- 📥 Booking management: view, track, cancel bookings
- 🎫 Unique PNR generation per booking
- 📜 Booking history

### 🖥️ System features
- 🔁 RESTful API architecture
- 🔒 Password hashing with bcrypt
- 🧾 PDF ticket generation (PDFKit)
- 📱 Responsive design

---

## 🗂️ Project structure

```
├── backend/              # Node.js + Express backend
│   ├── controllers/      # Business logic
│   ├── middleware/       # auth, authorization, error handlers
│   ├── models/           # Mongoose models (User, Bus, Route, Booking)
│   ├── routes/           # API routes (auth, users, buses, bookings, admin)
│   ├── server.js         # Backend entry point
│   └── package.json
│
├── frontend/             # React + Vite frontend (User)
│   ├── src/
│   │   ├── pages/        # Login, Register, Home, BusListing, SeatSelection, MyBookings, Dashboard
│   │   ├── components/   # UI components
│   │   └── services/     # API service layer (api.js)
│   └── package.json
│
├── frontend-admin/       # React + Vite frontend (Admin Panel)
│   ├── src/
│   │   ├── pages/        # AdminLogin, AdminDashboard, BusesManagement, RoutesManagement, BookingsManagement, UsersManagement
│   │   └── services/
│   └── package.json
│
└── README.md
```

---

## ⚙️ Prerequisites

- Node.js (v18+ recommended) 🟢
- MongoDB (local or Atlas) 🗄️
- npm  📦

---

## ⬇️ Installation

1. Install backend dependencies
```bash
cd backend
npm install
```

2. Install user frontend dependencies
```bash
cd frontend
npm install
```

3. Install admin frontend dependencies
```bash
cd frontend-admin
npm install
```

---

## 🔐 Environment variables

Create a `.env` file in `backend/` and set:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/busit
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
```

⚠️ Important: Replace `JWT_SECRET` with a secure random string and do not commit `.env`.

---

## ▶️ Running the application

Option A — manual (recommended for development):

Terminal 1 — backend
```bash
cd backend
npm run dev    # runs with nodemon
```

Terminal 2 — user frontend
```bash
cd frontend
npm run dev    # Vite dev server (default: http://localhost:3000)
```

Terminal 3 — admin frontend (optional)
```bash
cd frontend-admin
npm run dev    # Admin panel (default: http://localhost:3001)
```

Option B — VS Code Tasks  
If VS Code tasks are configured, run the "Start Full Stack" task to start backend and frontends.

---

## 🧭 Using the application

1. 📝 Register: create account with name, email, password  
2. 🔑 Login: sign in  
3. 🔎 Search buses: pick source, destination, date → Search  
4. 🪑 Select seats: open a bus, choose seats, enter passenger details  
5. ✅ Confirm booking → PDF ticket available for download  
6. 📂 My bookings: view, cancel bookings (if cancellation allowed)

---

## 🔌 API endpoints (overview)

**Authentication**
- POST /api/auth/register
- POST /api/auth/login

**User (protected)**
- GET /api/users/me
- GET /api/users

**Buses & Booking**
- GET /api/buses
- GET /api/buses/:id
- POST /api/bookings
- GET /api/bookings/:id/ticket  — download PDF ticket

**Admin (protected — admin role)**
- GET /api/admin/buses
- POST /api/admin/buses
- PUT /api/admin/buses/:id
- DELETE /api/admin/buses/:id
- GET /api/admin/routes
- POST /api/admin/routes
- PUT /api/admin/routes/:id
- DELETE /api/admin/routes/:id
- GET /api/admin/bookings
- PUT /api/admin/bookings/:id/cancel
- GET /api/admin/users
- PUT /api/admin/users/:id/role
- DELETE /api/admin/users/:id
- GET /api/admin/dashboard/stats

(Refer to route files in backend/routes for full details and request/response payloads.)

---

## 🛠️ Admin panel features

- 🔐 Separate admin login
- 🧾 Role-based access control (admin, super_admin)
- 📊 Dashboard: users, buses, routes, bookings, revenue
- 🚌 Bus & route management (create/edit/delete)
- 🧾 Booking management (view/cancel)
- 👤 User management (view/change role/delete)

Ensure admin users in DB have `role: "admin"` or `role: "super_admin"`.

---

## 🖼️ Screenshots

Add screenshots to the repository under `docs/screenshots/` (recommended). Commit the images and reference them below. Example filenames:

- `docs/screenshots/home.png`
- `docs/screenshots/bus-listing.png`
- `docs/screenshots/seat-selection.png`
- `docs/screenshots/booking-confirmation.png`
- `docs/screenshots/my-bookings.png`
- `docs/screenshots/admin-dashboard.png`

Placeholders (replace with your actual screenshots after adding images to the repo):

### 🏠 Home / Search Page
![Home / Search Page](docs/screenshots/home.png)

### 🧾 Bus Listing / Search Results
![Bus Listing](docs/screenshots/bus-listing.png)

### 🪑 Seat Selection
![Seat Selection](docs/screenshots/seat-selection.png)

### 🎫 Booking Confirmation / Ticket
![Booking Confirmation](docs/screenshots/booking-confirmation.png)

### 📂 My Bookings / Booking History
![My Bookings](docs/screenshots/my-bookings.png)

### 🛠️ Admin Dashboard
![Admin Dashboard](docs/screenshots/admin-dashboard.png)

Notes:
- To add a screenshot: create `docs/screenshots/` in repo and commit images with the names above.
- Use relative paths in the README so GitHub shows previews automatically.
- If file names differ, update the image links accordingly.

---

## 💻 Development & useful commands

Backend:
```bash
npm run dev    # start with nodemon
npm start      # start production
npm run seed   # populate DB with sample data (if provided)
```

Frontend (user & admin):
```bash
npm run dev     # start Vite dev server
npm run build   # build for production
npm run preview # preview production build
```

Default dev ports:
- Backend: http://localhost:5000
- User frontend: http://localhost:3000
- Admin frontend: http://localhost:3001

If you change backend port, update the frontend proxy in `vite.config.js`.

---

## 🚀 Future enhancements

- 💳 Payment gateway integration
- 📲 SMS alerts
- 👥 Multiple-passenger booking in one transaction
- 🪑 Seat type preferences (window/aisle)
- 🎟️ Discount coupons and offers
- ⭐ Rating & review system
- 🔁 Refund management
- 📍 Bus tracking (real-time)
- 🌐 Multi-language support

Implemented:
- ✅ Email notifications for bookings
- ✅ Admin panel for bus/route management
- ✅ PDF ticket generation

---

## 🐞 Troubleshooting

**MongoDB connection error**
- Ensure MongoDB is running and `MONGODB_URI` is correct
- For Atlas, whitelist your IP

**Port in use**
- Change `PORT` in backend `.env` and update frontend proxy if needed

**Booking conflict (seat already taken)**
- Refresh seat selection; the app validates availability before confirming

**Admin login fails**
- Confirm user has `role: "admin"` or `role: "super_admin"` in DB:
```js
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" }})
```

---

## 📄 Notes

- Never commit `.env` or other secrets to version control. 🔒  
- Default seat layout is 4 seats per row with automatic aisle spacing. 🪑  
- Remove console.logs from frontend for production readiness. ✅

---

## 📜 License

MIT

---

