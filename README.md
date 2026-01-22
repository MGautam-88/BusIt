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

Terminal 1 — backend
```bash
cd backend
npm start   
```

Terminal 2 — user frontend
```bash
cd frontend
npm run dev    #(default: http://localhost:3000)
```

Terminal 3 — admin frontend (optional)
```bash
cd frontend-admin
npm run dev    # Admin panel(default: http://localhost:3001)
```

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

### 🏠 Home / Search Page
<img width="2845" height="1537" alt="image" src="https://github.com/user-attachments/assets/38914510-e347-42ad-b4b1-d68baf3d8f6b" />


### 🧾 Bus Listing / Search Results
<img width="2833" height="1473" alt="image" src="https://github.com/user-attachments/assets/3ce1918f-410c-4524-824c-56c6371b3b44" />


### 🪑 Seat Selection
<img width="2846" height="1530" alt="image" src="https://github.com/user-attachments/assets/8ab544cd-865e-4ca6-8c60-746e2a461230" />


### 🎫 Booking Confirmation / Ticket
<img width="2844" height="1532" alt="image" src="https://github.com/user-attachments/assets/5c3d8470-7d69-48f7-b0fe-9a88e90f24f2" />
<img width="2849" height="1534" alt="image" src="https://github.com/user-attachments/assets/bee715e0-8bbe-4152-8fee-03f188feeaca" />
<img width="2846" height="1534" alt="image" src="https://github.com/user-attachments/assets/54a9dbf3-96dc-4a5b-9bf6-2a5f41b5891f" />




### 📂 My Bookings / Booking History
<img width="2850" height="1536" alt="image" src="https://github.com/user-attachments/assets/fe2d1b48-4c36-4f50-a0c3-59a82fac04bf" />

___________________________________________________________________

### 🛠️ Admin Dashboard
<img width="2879" height="1537" alt="image" src="https://github.com/user-attachments/assets/c0d53dcc-0834-4fd3-8f28-81de119b3891" />

### 🚍 Manage Buses
<img width="2879" height="1434" alt="image" src="https://github.com/user-attachments/assets/829b2ead-e7ad-44f3-b4df-837e919cd2ad" />
<img width="2553" height="1012" alt="image" src="https://github.com/user-attachments/assets/0c6abf1f-f4ff-4124-b3d0-8e9f3edff2fb" />

### 🛣️ Manage Routes
<img width="2879" height="1538" alt="image" src="https://github.com/user-attachments/assets/3aea9cb9-71fe-4904-b1ba-c38322222133" />
<img width="2540" height="1199" alt="image" src="https://github.com/user-attachments/assets/b29fbbfd-551b-480c-a708-fc1ef2a5d4a4" />

### 📝 Manage Bookings 
<img width="2877" height="1533" alt="image" src="https://github.com/user-attachments/assets/b32b0458-bdf1-4a0c-a2f0-0c30a5d3511c" />









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





