const express = require("express");
const router = express.Router();
const db = require("../database");

// Try to load bcrypt, use fallback if not available
let bcrypt;
try {
  bcrypt = require("bcrypt");
} catch (e) {
  console.warn("⚠️  bcrypt not available, password hashing disabled");
  console.warn("   Install with: npm install bcrypt");
  // Fallback for development only
  bcrypt = {
    hash: async (password) => password,
    compare: async (password, hash) => password === hash,
  };
}

// REGISTER
router.post("/register", async (req, res) => {
  const { email, username, password } = req.body;

  console.log("Register attempt:", { email, username });

  if (!email || !username || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `INSERT INTO users (email, username, password, role) VALUES (?, ?, ?, 'user')`;

    db.run(query, [email, username, hashedPassword], function (err) {
      if (err) {
        console.error("Registration error:", err);
        if (err.message.includes("UNIQUE constraint failed: users.email")) {
          return res.status(409).json({ error: "Email already registered" });
        }
        if (err.message.includes("UNIQUE constraint failed: users.username")) {
          return res.status(409).json({ error: "Username already taken" });
        }
        return res.status(500).json({ error: "Failed to create account" });
      }

      console.log("User registered successfully:", email);

      res.status(201).json({
        message: "Registration successful",
        user: {
          id: this.lastID,
          email,
          username,
          role: "user",
        },
      });
    });
  } catch (error) {
    console.error("Hash error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  console.log("Login attempt:", { email });

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (!user) {
      console.log("User not found:", email);
      return res.status(404).json({ error: "No account found with this email" });
    }

    try {
      console.log("User found:", user.email, "role:", user.role);

      // Compare password
      const isValidPassword = await bcrypt.compare(password, user.password);
      console.log("Password valid:", isValidPassword);

      if (!isValidPassword) {
        return res.status(401).json({ error: "Incorrect password" });
      }

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      console.log("Login successful for:", user.email);

      res.json({
        message: "Login successful",
        user: userWithoutPassword,
      });
    } catch (error) {
      console.error("Password comparison error:", error);
      res.status(500).json({ error: "Authentication error" });
    }
  });
});

// LOGOUT (client-side, but can add token blacklist in future)
router.post("/logout", (req, res) => {
  res.json({ message: "Logout successful" });
});

module.exports = router;
