# SportCity Backend API

A Node.js/Express backend server for the SportCity sports terrain rental platform.

## Features

- User authentication (signup/login with JWT tokens)
- SQLite database for data persistence
- Complete CRUD operations for terrain management
- Role-based access control (admin/user)
- CORS enabled for frontend integration
- Password hashing with bcryptjs

## Prerequisites

- Node.js (v14 or higher)
- npm

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with configuration:
```
PORT=5000
JWT_SECRET=your_jwt_secret_key_change_in_production
NODE_ENV=development
DB_PATH=./database.db
```

## Running the Server

Start the development server:
```bash
npm start
```

or

```bash
node index.js
```

The server will start on `http://localhost:5000`

## Project Structure

```
backend/
├── index.js              # Main server file
├── database.js           # Database initialization
├── .env                  # Environment variables
├── package.json          # Dependencies
├── routes/
│   ├── auth.js          # Authentication routes
│   └── terrains.js      # Terrain management routes
└── middleware/
    └── auth.js          # JWT authentication middleware
```

## API Endpoints

### Authentication

#### Sign Up
- **Endpoint:** `POST /api/auth/signup`
- **Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "user"
}
```
- **Response:**
```json
{
  "message": "User created successfully",
  "token": "eyJhbGc...",
  "user": { "id": 1, "email": "user@example.com", "role": "user" }
}
```

#### Login
- **Endpoint:** `POST /api/auth/login`
- **Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
- **Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": { "id": 1, "email": "user@example.com", "role": "user" }
}
```

### Terrains

#### Get All Terrains
- **Endpoint:** `GET /api/terrains`
- **Response:** Array of terrain objects

#### Get Terrain by ID
- **Endpoint:** `GET /api/terrains/:id`
- **Response:** Single terrain object

#### Get My Terrains (Authenticated)
- **Endpoint:** `GET /api/terrains/user/my-terrains`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Array of user's terrains

#### Create Terrain (Authenticated)
- **Endpoint:** `POST /api/terrains`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "nom": "Terrain Central",
  "sport": "Football",
  "adresse": "123 Rue de Paris",
  "ville": "Paris",
  "taille": 5000,
  "horaires": "09:00 - 18:00",
  "date": "2024-12-31",
  "prix": 25,
  "description": "Professional football field"
}
```
- **Response:**
```json
{
  "message": "Terrain created successfully",
  "id": 1,
  "terrain": { ... }
}
```

#### Update Terrain (Authenticated)
- **Endpoint:** `PUT /api/terrains/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** Same structure as create
- **Response:**
```json
{
  "message": "Terrain updated successfully",
  "id": 1
}
```

#### Delete Terrain (Authenticated)
- **Endpoint:** `DELETE /api/terrains/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
{
  "message": "Terrain deleted successfully"
}
```

#### Search Terrains
- **Endpoint:** `GET /api/terrains/search/:query`
- **Parameters:** query (searches in nom, ville, sport)
- **Response:** Array of matching terrains

### Health Check

- **Endpoint:** `GET /api/health`
- **Response:**
```json
{
  "status": "Backend is running",
  "timestamp": "2024-12-09T12:00:00.000Z"
}
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Terrains Table
```sql
CREATE TABLE terrains (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom TEXT NOT NULL,
  sport TEXT NOT NULL,
  adresse TEXT NOT NULL,
  ville TEXT NOT NULL,
  taille INTEGER NOT NULL,
  horaires TEXT,
  date TEXT,
  prix REAL NOT NULL,
  description TEXT,
  user_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
)
```

## Environment Variables

- `PORT`: Server port (default: 5000)
- `JWT_SECRET`: Secret key for JWT tokens
- `NODE_ENV`: Environment (development/production)
- `DB_PATH`: Path to SQLite database file

## Error Handling

The API returns appropriate HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Server Error

## Security Notes

1. Change the `JWT_SECRET` in production
2. Passwords are hashed using bcryptjs
3. All protected routes require a valid JWT token
4. CORS is configured for localhost frontend development

## Development

To add more features:

1. Create new route files in the `routes/` directory
2. Import them in `index.js`
3. Use the provided database helper functions (dbRun, dbGet, dbAll)
4. Add authentication middleware to protected routes

## Notes

- The database is automatically created on first run
- Default database location: `./database.db` (in backend directory)
- The server logs all requests with timestamps
- Frontend should be configured to use `http://localhost:5000` as the API base URL

## License

ISC
