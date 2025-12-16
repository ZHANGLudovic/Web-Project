# 🏟️ SportCity - Sports Field Booking Platform

A modern, full-stack web application for booking sports fields online. Built with Vue.js and Node.js.

## ✨ Features

### User Features
- 🔐 **Authentication System** - Secure login and registration
- 🏟️ **Browse Fields** - View available sports fields with images
- 🔍 **Search & Filter** - Filter by sport type, city, and search by name
- 📅 **Real-time Booking** - Book available time slots with live availability
- 📊 **My Reservations** - View and manage your bookings
- ⏰ **Time Slot Management** - Hourly booking system (08:00 - 22:00)

### Admin Features
- ➕ **Add Fields** - Create new sports fields
- ✏️ **Edit Fields** - Modify existing field details
- 🗑️ **Delete Fields** - Remove fields from the system
- 👥 **User Management** - Admin account with elevated privileges

### Sports Supported
- ⚽ Football
- 🏀 Basketball
- 🎾 Tennis
- 🏐 Volleyball
- 🏸 Badminton

## 🛠️ Tech Stack

### Frontend
- **Vue.js 3** - Progressive JavaScript framework
- **Vue Router** - Client-side routing
- **CSS3** - Modern styling with CSS variables
- **Vite** - Next generation frontend tooling

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **SQLite3** - Embedded relational database
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
Web-Project/
├── frontend/
│   ├── src/
│   │   ├── components/     # Vue components
│   │   ├── views/          # Page views
│   │   ├── Image/          # Static images
│   │   ├── App.vue         # Root component
│   │   ├── main.js         # Entry point
│   │   └── router.js       # Route configuration
│   └── package.json
│
├── backend/
│   ├── routes/             # API routes
│   │   ├── auth.js         # Authentication
│   │   ├── fields.js       # Field management
│   │   ├── reservations.js # Booking system
│   │   └── ...
│   ├── scripts/            # Utility scripts
│   ├── database.js         # Database setup
│   ├── index.js            # Server entry point
│   └── package.json
│
└── readme.md
```

## 🚀 Installation

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

## ▶️ Running the Application

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

## 👤 Default Admin Account

```
Email: admin@sportcity.com
Password: admin123
```

## 📡 API Endpoints

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

## 🗄️ Database Schema

### Tables
- **users** - User accounts and authentication
- **fields** - Sports field information
- **reservations** - Booking records
- **time_slots** - Individual time slot bookings
- **sports** - Available sports types
- **reviews** - Field reviews and ratings

## 🎨 Design Features

- 🌈 Modern gradient UI with purple theme
- 📱 Fully responsive design
- ✨ Smooth animations and transitions
- 🎯 Intuitive user interface
- 🔔 Toast notifications for user feedback
- 📄 Pagination system (5 items per page)

## 🔧 Utility Scripts

```bash
# Update field images
npm run update-images

# Clean admin accounts
npm run clean-admins

# Make user admin
npm run make-admin
```

## 🚧 Development

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

## 📦 Build for Production

### Frontend
```bash
cd frontend
npm run build
```

## 🔐 Security Features

- Password hashing with bcrypt
- Foreign key constraints
- Input validation
- SQL injection prevention
- CORS configuration

## 🐛 Troubleshooting

### Database Issues
If you encounter database issues, delete `database.db` and restart the server. It will recreate the database with seed data.

### Port Already in Use
If port 3000 or 8080 is already in use:
```bash
# Change backend port in index.js
const PORT = process.env.PORT || 3001;

# Change frontend port in vite.config.js or package.json
```

## 📝 License

This project is licensed under the MIT License.

## 👥 Contributors

- Your Name - Initial work

## 🙏 Acknowledgments

- Vue.js team for the amazing framework
- Express.js community
- All open-source contributors

## 📧 Contact

For any inquiries, please contact: contact@sportcity.com

---

Made with ❤️ by SportCity Team