# SportCity Backend - v2.0.0

Professional sports field booking platform backend with comprehensive features for production-ready applications.

## 🎯 New Features Added

### 1. **Improved Database Schema**
- Added indexes for faster queries on frequently searched fields
- Enhanced constraints with CHECK and UNIQUE validations
- Added timestamps (created_at, updated_at) for all records
- New fields: `image_url`, `rating`, `review_count`, `capacity` in fields table
- Database tables now include: users, fields, reservations, sports, reviews

### 2. **Enhanced Field Management**
- Pagination support (page/limit parameters)
- Advanced filtering by sport, city, and search query
- Field availability status tracking
- Image URL support for field photos
- Capacity management
- Rating system integrated with reviews
- Dedicated endpoints for sport and city-based searches

### 3. **Comprehensive Reservation System**
- Time conflict detection (prevents double-booking)
- Reservation status tracking (confirmed, cancelled)
- Support for reservation notes
- Pagination for user reservations
- Filter by status
- Automatic timestamp management

### 4. **User Review & Rating System**
- 5-star rating system
- User reviews with comments
- Automatic field rating calculation (average)
- Review count tracking
- Prevent duplicate reviews per user
- Full CRUD operations for reviews

### 5. **Input Validation**
- Email format validation
- Password strength requirements (minimum 6 characters)
- Username validation (3-30 characters)
- Price validation (positive numbers)
- Rating validation (1-5 stars)
- Time format validation (HH:mm)
- Date validation (future dates only)

### 6. **Improved Error Handling**
- Detailed error messages for validation failures
- Specific error responses for conflicts (409)
- Database error handling
- 404 responses for missing resources
- Global error middleware
- Request logging

### 7. **Better CORS & Security**
- Configured CORS for development
- JSON middleware
- Request logging middleware

## 📁 Project Structure

```
backend/
├── database.js           # SQLite database initialization & schema
├── index.js              # Express server setup & routes
├── package.json
├── middleware/
│   └── validation.js     # Input validation functions
└── routes/
    ├── auth.js           # Authentication (register, login, logout)
    ├── fields.js         # Field listing, search, CRUD operations
    ├── users.js          # User profile & reservations
    ├── sports.js         # Sports CRUD & statistics
    └── reviews.js        # Reviews & ratings system
```

## 🔌 API Endpoints

### Authentication (`/auth`)
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

### Fields (`/fields`)
- `GET /fields` - List all fields (with pagination & filtering)
- `GET /fields/:id` - Get field details with reviews
- `POST /fields` - Create new field
- `PUT /fields/:id` - Update field
- `DELETE /fields/:id` - Delete field
- `GET /fields/sport/:sport` - Get fields by sport
- `GET /fields/city/:city` - Get fields by city

### Users (`/users`)
- `GET /users/:id` - Get user profile
- `PUT /users/:id` - Update profile
- `GET /users/:id/reservations` - List user reservations
- `POST /users/:id/reservations` - Create reservation
- `PUT /users/:id/reservations/:reservationId` - Update reservation
- `DELETE /users/:id/reservations/:reservationId` - Cancel reservation

### Sports (`/sports`)
- `GET /sports` - List all sports
- `GET /sports/with-count` - Sports with field counts
- `GET /sports/:id` - Get sport details
- `POST /sports` - Create sport
- `PUT /sports/:id` - Update sport
- `DELETE /sports/:id` - Delete sport

### Reviews (`/reviews`)
- `GET /reviews/field/:fieldId` - Get field reviews (paginated)
- `GET /reviews/field/:fieldId/user/:userId` - Get user's review
- `POST /reviews` - Create review
- `PUT /reviews/:id` - Update review
- `DELETE /reviews/:id` - Delete review

### Health Check
- `GET /health` - Backend status
- `GET /` - API information

## 🚀 Running the Backend

```bash
# Install dependencies
npm install

# Start the server
npm start

# The server will run on http://localhost:3000
```

## 📊 Query Examples

### Search fields with pagination and filters
```
GET /fields?sport=Football&city=Paris&page=1&limit=12&search=central
```

### Get user reservations with status filter
```
GET /users/1/reservations?status=confirmed&page=1&limit=10
```

### Get field reviews with pagination
```
GET /reviews/field/1?page=1&limit=10
```

## ✅ Validation Rules

- **Email**: Must be valid email format
- **Password**: Minimum 6 characters
- **Username**: 3-30 characters
- **Price**: Positive number
- **Rating**: Integer from 1-5
- **Time**: Format HH:mm (24-hour)
- **Date**: Future date only

## 🔄 Key Improvements Summary

| Feature | Before | After |
|---------|--------|-------|
| Database | Basic schema | Optimized with indexes & constraints |
| Filtering | None | Advanced filtering & search |
| Pagination | None | Full pagination support |
| Validation | Minimal | Comprehensive validation |
| Reviews | None | Full review & rating system |
| Error Handling | Basic | Detailed error responses |
| Time Conflicts | None | Automatic conflict detection |
| Status Tracking | None | Complete status management |
| Timestamps | None | Auto timestamps on all records |

## 🛠️ Technologies

- **Framework**: Express.js
- **Database**: SQLite3
- **Authentication**: Basic (email/password)
- **CORS**: Enabled for development

## 📝 Notes

- All dates/times use ISO 8601 format
- All prices are stored as REAL (decimal)
- Ratings are calculated as average of all reviews
- Reservations include automatic conflict detection
- Database file: `database.db`

## 🔐 Security Considerations

For production deployment, consider:
- Implement JWT authentication
- Use password hashing (bcrypt)
- Add rate limiting
- Implement HTTPS
- Add request validation middleware
- Implement proper CORS policies
- Add database encryption
- Implement API key management

---

**Version**: 2.0.0  
**Last Updated**: December 2024
