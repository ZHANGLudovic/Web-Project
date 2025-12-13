const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const terrainsRoutes = require("./routes/terrains");
const sportsRoutes = require("./routes/sports");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/terrains", terrainsRoutes);
app.use("/sports", sportsRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "Backend is running", timestamp: new Date().toISOString() });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({ message: "SportCity Backend API", version: "1.0.0" });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
