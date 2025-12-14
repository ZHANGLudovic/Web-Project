const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const fieldsRoutes = require("./routes/fields");
const usersRoutes = require("./routes/users");
const sportsRoutes = require("./routes/sports");
const reviewsRoutes = require("./routes/reviews");

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/auth", authRoutes);
app.use("/fields", fieldsRoutes);
app.use("/users", usersRoutes);
app.use("/sports", sportsRoutes);
app.use("/reviews", reviewsRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "Backend is running", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({ 
    message: "SportCity Backend API", 
    version: "2.0.0",
    endpoints: {
      auth: "/auth",
      fields: "/fields",
      users: "/users",
      sports: "/sports",
      reviews: "/reviews"
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
