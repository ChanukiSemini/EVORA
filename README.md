# ⚡ EVORA - Smart EV Charging Management & Reservation Platform

> A modern, full-stack Electric Vehicle (EV) charging station discovery, real-time slot reservation, and infrastructure management system tailored for the Sri Lankan EV ecosystem.

---

## 🚗 About the Project

**EVORA** is an end-to-end smart charging platform built to eliminate range anxiety and streamline the EV charging experience. It bridges the gap between EV drivers and charging network hosts by offering:

- Interactive charging station discovery with real-time port availability, power ratings, and pricing.
- Hassle-free time-slot reservations with real-time validation to prevent double bookings.
- Dedicated user portals for drivers to track charging history, manage vehicles, and leave station reviews.
- A robust administrative control panel for managing station infrastructure, monitoring charger telemetry, handling support cases, and analyzing usage metrics.

---

## ✨ Key Features

### 🚙 For EV Drivers
- **Interactive Station Discovery**: Browse nearby EV charging stations across Sri Lanka with real-time status indicators (*Available, Limited, Occupied*).
- **Comprehensive Filtering**: Filter stations by connector types (CCS2, Type 2, CHAdeMO, Tesla NACS), power output (kW), pricing, and amenities (Wi-Fi, Cafe, Restroom, Shopping).
- **Smart Slot Booking**: Select charging bays, reservation dates, and time slots with upfront rate calculation (Fast DC vs Slow AC).
- **Reservation Lifecycle Management**: View upcoming and past reservations, reschedule booking times, or cancel bookings seamlessly.
- **Garage / Vehicle Profiles**: Register and manage multiple EV models (Tesla, Nissan Leaf, BYD, Hyundai, MG, etc.) to match compatible charging ports automatically.
- **Ratings & Reviews**: Share real-world charging experiences, rate facilities, and review station conditions.
- **Secure Driver Profiles**: Account creation, OTP phone/email verification, password hashing, and token-based authentication.

### 🏢 For Station Hosts & Network Operators
- **Host Onboarding**: Register new charging nodes, set operational hours, and specify power ratings.
- **Dynamic Pricing**: Configure standard kWh rates, peak pricing, and parking/idle penalties.
- **Port & Bay Management**: Monitor real-time status of individual charging bays.

### 🛡️ For Administrators
- **Executive Dashboard**: High-level overview of network utilization, daily revenue, active stations, and error alerts.
- **Infrastructure Management**: Register and configure hardware nodes, stations, and charging connectors.
- **Support Desk & Case Management**: Manage user inquiries, technician dispatch tickets, and incident resolution tracking.
- **Analytics & Reporting**: Download and inspect network usage reports, transaction logs, and station uptime metrics.

---

## 🛠️ Technologies Used

### Frontend
- **Framework & Libraries**: [React 19](https://react.dev/), [Vite](https://vitejs.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **3D Graphics & Visualizations**: [Three.js](https://threejs.org/), [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber), [@react-three/drei](https://github.com/pmndrs/drei)
- **Styling**: Vanilla CSS3 (Custom design system with dark mode glassmorphism, responsive CSS grid/flexbox)
- **Icons**: Lucide Icons & Custom SVG assets
- **Code Quality**: ESLint

### Backend
- **Runtime & Framework**: [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (Local or MongoDB Atlas)
- **ODM (Object Data Modeling)**: [Mongoose v8](https://mongoosejs.com/)
- **Authentication & Security**: [JSON Web Tokens (JWT)](https://jwt.io/), [Bcrypt.js](https://github.com/dcodeIO/bcrypt.js)
- **Utilities**: CORS, Dotenv, Node-Fetch, Nodemon (Development)

---

## 🚀 Getting Started & Installation

Follow these steps to set up and run EVORA locally on your system.

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) running locally on port `27017` **OR** a [MongoDB Atlas](https://www.mongodb.com/atlas) cloud database URI.
- [Git](https://git-scm.com/)

---

### 1. Clone the Repository

```bash
git clone https://github.com/ChanukiSemini/EVORA.git
cd EVORA
```

---

### 2. Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd evora-backend
   ```

2. **Install backend dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in `evora-backend/` (or copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

   Ensure your `.env` contains the appropriate configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://127.0.0.1:27017/evora
   JWT_SECRET=evora_secret_jwt_key_2026
   ```

4. **Seed Database with Initial Station Data** *(Optional but recommended)*:
   Populate MongoDB with Sri Lankan sample stations (One Galle Face, Colombo City Centre, Arcade Independence, Havelock City, etc.):
   ```bash
   npm run seed
   ```

5. **Start the Backend Server**:
   - **Development mode (with auto-reload)**:
     ```bash
     npm run dev
     ```
   - **Production mode**:
     ```bash
     npm start
     ```

   The backend will be running at `http://localhost:5000`. You can verify by opening `http://localhost:5000/api/health`.

---

### 3. Frontend Setup

1. **Open a new terminal window** and navigate to the frontend directory:
   ```bash
   cd evora-frontend
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Start the Vite Development Server**:
   ```bash
   npm run dev
   ```

4. **Open in Browser**:
   Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

---

## 📡 API Endpoints Overview

| Base Path | Description |
|---|---|
| `GET /api/health` | Health check endpoint |
| `/api/auth` | User registration, login, token verification, and OTP handling |
| `/api/drivers` | Driver profile management, vehicle management, and history |
| `/api/stations` | Station listing, filter queries, bay availability, and detail lookup |
| `/api/bookings` | Create, reschedule, cancel, and retrieve charging reservations |
| `/api/reviews` | Fetch and submit station reviews and star ratings |
| `/api/admin` | Hardware registration, infrastructure control, case handling, and reports |

---

## 📂 Project Structure

```
EVORA/
├── evora-backend/                  # Express.js REST API server
│   ├── config/                     # Database connection setup (Mongoose)
│   ├── controllers/                # Request logic and business controllers
│   ├── middleware/                 # Auth protection & error handling middleware
│   ├── models/                     # Mongoose schemas (User, Station, Booking, Vehicle, etc.)
│   ├── routes/                     # API routing definitions
│   ├── utils/                      # Helper scripts and database seeder (seed.js)
│   ├── .env.example                # Example environment configuration
│   ├── server.js                   # Application entry point
│   └── package.json                # Backend dependencies and scripts
│
├── evora-frontend/                 # React 19 + Vite client application
│   ├── public/                     # Static assets and icons
│   ├── src/
│   │   ├── assets/                 # Component images, SVG logos, and banners
│   │   ├── components/             # Reusable UI components (Navbar, Modals, 3D Canvas)
│   │   ├── context/                # Global React Context providers (Auth, Booking state)
│   │   ├── data/                   # Mock fallback station catalogs and test data
│   │   ├── pages/                  # Application views (FindStation, BookCharger, Profile, etc.)
│   │   │   └── admin/              # Admin dashboard, reports, support desk, hardware registry
│   │   ├── styles/                 # Modular CSS stylesheets
│   │   ├── App.jsx                 # Route configurations and layout assembly
│   │   └── main.jsx                # Application root mounting point
│   ├── index.html                  # HTML entry point
│   ├── vite.config.js              # Vite configuration
│   └── package.json                # Frontend dependencies and scripts
│
└── README.md                       # Project documentation
```

---

## 👥 Group Members

| # | Member Name | Student ID / Reg No |
|---|---|---|
| 1 | Chanuki Semini Hettiarachchi | AS20240953 |
| 2 | R.K.D.A. Kasundhi | AS20240980 |
| 3 | L.A.D.P.S.wijethunga | AS20240969 |
| 4 | R.A.A.D Morathota | AS20240975 |
| 5 | M.S.S. Sigera | AS20240912 |

---

