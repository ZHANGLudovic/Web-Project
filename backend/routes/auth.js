const express = require("express");
const router = express.Router();
const db = require("../database");

// REGISTER
router.post("/register", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  db.run(
    "INSERT INTO users (email, password) VALUES (?, ?)",
    [email, password],
    function (err) {
      if (err) return res.status(400).json({ error: "Email already exists" });
      res.json({ message: "User registered successfully", id: this.lastID });
    }
  );
});

// LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  db.get(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password],
    (err, user) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (!user) return res.status(401).json({ error: "Invalid credentials" });

      res.json({ message: "Login successful", user });
    }
  );
});

module.exports = router;
