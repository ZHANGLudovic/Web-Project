const express = require("express");
const router = express.Router();
const db = require("../database");
const { validateEmail, validatePassword, validateUsername } = require("../middleware/validation");

// REGISTER
router.post("/register", (req, res) => {
  const { email, password, username, role = 'user' } = req.body;

  // Validation
  if (!email || !password || !username) {
    return res.status(400).json({ error: "Email, password, and username are required" });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  if (!validateUsername(username)) {
    return res.status(400).json({ error: "Username must be 3-30 characters" });
  }

  db.run(
    "INSERT INTO users (email, password, username, role) VALUES (?, ?, ?, ?)",
    [email, password, username, role],
    function (err) {
      if (err) {
        if (err.message.includes("UNIQUE")) {
          return res.status(400).json({ error: "Email or username already exists" });
        }
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ 
        message: "User registered successfully", 
        id: this.lastID,
        username: username,
        role: role
      });
    }
  );
});

// LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  db.get(
    "SELECT id, email, username, role FROM users WHERE email = ? AND password = ?",
    [email, password],
    (err, user) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (!user) return res.status(401).json({ error: "Invalid credentials" });

      res.json({ 
        message: "Login successful", 
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role
        }
      });
    }
  );
});

// LOGOUT (client-side, but can add token blacklist in future)
router.post("/logout", (req, res) => {
  res.json({ message: "Logout successful" });
});

module.exports = router;
