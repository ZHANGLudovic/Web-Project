const express = require("express");
const router = express.Router();
const db = require("../database");

// GET all sports
router.get("/", (req, res) => {
  db.all("SELECT * FROM sports ORDER BY name ASC", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res.json(rows || []);
  });
});

// GET sports with field count
router.get("/with-count", (req, res) => {
  db.all(
    `SELECT s.*, COUNT(f.id) as field_count 
     FROM sports s 
     LEFT JOIN fields f ON s.name = f.sport AND f.available = 1
     GROUP BY s.id 
     ORDER BY field_count DESC`,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      res.json(rows || []);
    }
  );
});

// GET sport by ID
router.get("/:id", (req, res) => {
  db.get("SELECT * FROM sports WHERE id = ?", [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    if (!row) {
      return res.status(404).json({ error: "Sport not found" });
    }
    res.json(row);
  });
});

// ADD a sport
router.post("/", (req, res) => {
  const { name, icon, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Sport name is required" });
  }

  db.run(
    "INSERT INTO sports (name, icon, description) VALUES (?, ?, ?)",
    [name, icon || null, description || null],
    function (err) {
      if (err) {
        if (err.message.includes("UNIQUE")) {
          return res.status(400).json({ error: "Sport already exists" });
        }
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ 
        id: this.lastID, 
        name, 
        icon, 
        description,
        message: "Sport added successfully" 
      });
    }
  );
});

// UPDATE a sport
router.put("/:id", (req, res) => {
  const { name, icon, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Sport name is required" });
  }

  db.run(
    "UPDATE sports SET name = ?, icon = ?, description = ? WHERE id = ?",
    [name, icon || null, description || null, req.params.id],
    function (err) {
      if (err) {
        if (err.message.includes("UNIQUE")) {
          return res.status(400).json({ error: "Sport name already exists" });
        }
        return res.status(500).json({ error: "Database error" });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: "Sport not found" });
      }
      res.json({ message: "Sport updated successfully" });
    }
  );
});

// DELETE a sport
router.delete("/:id", (req, res) => {
  db.run("DELETE FROM sports WHERE id = ?", [req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Sport not found" });
    }
    res.json({ message: "Sport deleted successfully" });
  });
});

module.exports = router;
