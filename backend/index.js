require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./database');

// Import routes
const authRoutes = require('./routes/auth');
const terrainsRoutes = require('./routes/terrains');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:3000', 'http://127.0.0.1:8080'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/terrains', terrainsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'SportCity Backend API', version: '1.0.0' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Initialize database and start server
const startServer = async () => {
  try {
    await initializeDatabase();
    console.log('✓ Database initialized successfully');

    app.listen(PORT, () => {
      console.log('');
      console.log('╔════════════════════════════════════╗');
      console.log('║    🏟️ SportCity Backend Server     ║');
      console.log('╠════════════════════════════════════╣');
      console.log(`║ Server running on port: ${PORT}            ║`);
      console.log(`║ Environment: ${process.env.NODE_ENV || 'development'}         ║`);
      console.log('║ http://localhost:' + PORT + '                 ║');
      console.log('╠════════════════════════════════════╣');
      console.log('║ Available Routes:                  ║');
      console.log('║ POST   /api/auth/signup            ║');
      console.log('║ POST   /api/auth/login             ║');
      console.log('║ GET    /api/terrains               ║');
      console.log('║ GET    /api/terrains/:id           ║');
      console.log('║ POST   /api/terrains               ║');
      console.log('║ PUT    /api/terrains/:id           ║');
      console.log('║ DELETE /api/terrains/:id           ║');
      console.log('║ GET    /api/terrains/search/:query ║');
      console.log('╚════════════════════════════════════╝');
      console.log('');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
