# SportCity - Sports Field Booking Platform

SportCity is a modern, full-stack web application designed to simplify the process of booking sports facilities online. By bridging the gap between facility managers and athletes, the platform offers a streamlined way to find, schedule, and manage sports sessions. The project is built using a decoupled architecture with a Vue.js frontend and a Node.js backend.

## Project Overview

The goal of SportCity is to provide a frictionless user experience for sports enthusiasts while giving administrators the tools they need to manage their inventory effectively. Whether you are looking for a quick football match or a scheduled tennis session, the platform handles the logic of time slots and availability in real-time.

### For Users
* **Secure Access**: A complete authentication system for private account management.
* **Discovery**: Browse various sports fields with detailed information and high-quality imagery.
* **Smart Search**: Filter facilities by sport type (Football, Basketball, Tennis, Volleyball, Badminton) or location.
* **Booking Engine**: A real-time reservation system that manages hourly slots from 08:00 to 22:00.
* **Personal Dashboard**: A dedicated space to track, view, and manage upcoming or past reservations.

### For Administrators
* **Facility Management**: Full CRUD (Create, Read, Update, Delete) capabilities for sports fields.
* **User Oversight**: Elevated privileges to manage the user base and system settings.
* **Operational Control**: Tools to monitor bookings and ensure the platform remains up to date.

---

## Technical Architecture

The application is split into two main directories to separate concerns and allow for independent scaling or updates.

### Frontend
The client side is built as a Single Page Application (SPA) to ensure a smooth, desktop-like feel.
* **Framework**: Vue.js 3 (Composition API)
* **Routing**: Vue Router for seamless navigation.
* **Styling**: Modern CSS3 using custom variables for a consistent purple-themed UI.
* **Build Tool**: Vite for fast development and optimized production builds.

### Backend
The server handles data persistence, business logic, and security.
* **Runtime**: Node.js with the Express.js framework.
* **Database**: SQLite3 for a lightweight, file-based relational storage solution.
* **Security**: bcrypt for industry-standard password hashing and CORS for secure cross-origin requests.



---

## Project Structure

```
Web-Project/
├── frontend/             # Vue.js application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── views/        # Page-level components
│   │   ├── router.js     # Client-side navigation
│   │   └── main.js       # App initialization
│   └── package.json
│
├── backend/              # Node.js API
│   ├── routes/           # API endpoints (auth, fields, reservations)
│   ├── database.js       # SQLite configuration and seeding
│   ├── index.js          # Server entry point
│   └── package.json
└── readme.md

```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/Web-Project.git
cd Web-Project
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

## Running the Application

### Start Backend Server
```bash
cd backend
npm run dev
```
Server will run on `http://localhost:3000`

### Start Frontend Development Server
```bash
cd frontend
npm run dev
```
Application will run on `http://localhost:8080`

## Default Admin Account

```
Email: admin@sportcity.com
Password: admin123
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

### Fields
- `GET /fields` - Get all fields
- `GET /fields/:id` - Get field by ID
- `POST /fields` - Create new field (Admin)
- `DELETE /fields/:id` - Delete field (Admin)
- `GET /fields/:id/available-slots` - Get available time slots

### Reservations
- `GET /reservations` - Get all reservations
- `GET /reservations/user/:userId` - Get user's reservations
- `POST /reservations` - Create new reservation
- `DELETE /reservations/:id` - Cancel reservation

## Database Schema

### Tables
- **users** - User accounts and authentication
- **fields** - Sports field information
- **reservations** - Booking records
- **time_slots** - Individual time slot bookings
- **sports** - Available sports types
- **reviews** - Field reviews and ratings


## Utility Scripts

```bash
# Update field images
npm run update-images

# Clean admin accounts
npm run clean-admins

# Make user admin
npm run make-admin
```

## Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development
```bash
cd frontend
npm run dev  # Hot module replacement enabled
```

## Build for Production

### Frontend
```bash
cd frontend
npm run build
```

## Security Features

- Password hashing with bcrypt
- Foreign key constraints
- Input validation
- SQL injection prevention
- CORS configuration

## Troubleshooting

### Database Issues
If you encounter database issues, delete `database.db` and restart the server. It will recreate the database with seed data.

### Port Already in Use
If port 3000 or 8080 is already in use:
```bash
# Change backend port in index.js
const PORT = process.env.PORT || 3001;

# Change frontend port in vite.config.js or package.json
```

## Academic Context

This project was developed for academic purposes during an international exchange program at **Southeast University (SEU)** in Nanjing, China in the 3rd year of the Engineering Degree at **EFREI Paris**. The application serves as a practical application of full-stack development principles.

## Contributors
Timothée BOISSEAUX, Nazim MEKIDECHE and Ludovic ZHANG
