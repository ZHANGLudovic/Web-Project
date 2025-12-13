const express = require("express");
const router = express.Router();
const db = require("../database");

// GET all sports
router.get("/", (req, res) => {
  db.all("SELECT * FROM sports", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res.json(rows);
  });
});

// ADD a sport
router.post("/", (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  db.run(
    "INSERT INTO sports (name) VALUES (?)",
    [name],
    function (err) {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ id: this.lastID, name });
    }
  );
});

// UPDATE a sport
router.put("/:id", (req, res) => {
  const { name } = req.body;

  db.run(
    "UPDATE sports SET name = ? WHERE id = ?",
    [name, req.params.id],
    function (err) {
      if (err) {
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
