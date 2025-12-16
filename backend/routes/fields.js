const express = require("express");
const router = express.Router();
const db = require("../database");

// Get all fields
router.get("/", (req, res) => {
  const query = "SELECT * FROM fields ORDER BY created_at DESC";
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Error fetching fields:", err);
      return res.status(500).json({ error: "Failed to fetch fields" });
    }
    res.json(rows);
  });
});

// Create new field (admin only) - MUST BE BEFORE /:id routes
router.post("/", (req, res) => {
  const { nom, sport, adresse, ville, taille, horaires, prix, description, image_url } = req.body;

  if (!nom || !sport || !adresse || !ville || !taille || !prix) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const query = `
    INSERT INTO fields (nom, sport, adresse, ville, taille, horaires, prix, description, image_url, capacity)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 20)
  `;

  db.run(query, [nom, sport, adresse, ville, taille, horaires || '08:00 - 22:00', prix, description, image_url], function(err) {
    if (err) {
      console.error("Error creating field:", err);
      return res.status(500).json({ error: "Failed to create field" });
    }

    console.log("Field created with ID:", this.lastID);
    
    res.status(201).json({
      message: "Field created successfully",
      field: {
        id: this.lastID,
        nom, 
        sport, 
        adresse, 
        ville, 
        taille, 
        horaires: horaires || '08:00 - 22:00', 
        prix, 
        description, 
        image_url
      }
    });
  });
});

// Get available time slots for a field on a specific date
router.get("/:id/available-slots", (req, res) => {
  const { id } = req.params;
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ error: "Date parameter is required" });
  }

  const allSlots = [];
  for (let hour = 8; hour < 22; hour++) {
    allSlots.push(`${hour.toString().padStart(2, '0')}:00`);
  }

  const query = `
    SELECT time_slot 
    FROM time_slots 
    WHERE field_id = ? AND reservation_date = ?
  `;

  db.all(query, [id, date], (err, rows) => {
    if (err) {
      console.error("Error fetching reserved slots:", err);
      return res.status(500).json({ error: "Failed to fetch available slots" });
    }

    const reservedSlots = rows.map(row => row.time_slot);
    const availableSlots = allSlots.filter(slot => !reservedSlots.includes(slot));

    res.json({
      field_id: parseInt(id),
      date: date,
      reserved_slots: reservedSlots,
      available_slots: availableSlots,
      all_slots: allSlots
    });
  });
});

// Get field by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  
  db.get("SELECT * FROM fields WHERE id = ?", [id], (err, row) => {
    if (err) {
      console.error("Error fetching field:", err);
      return res.status(500).json({ error: "Failed to fetch field" });
    }
    if (!row) {
      return res.status(404).json({ error: "Field not found" });
    }
    res.json(row);
  });
});

// Delete field by ID (admin only)
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  
  db.get("SELECT * FROM fields WHERE id = ?", [id], (err, field) => {
    if (err) {
      console.error("Error finding field:", err);
      return res.status(500).json({ error: "Failed to find field" });
    }
    
    if (!field) {
      return res.status(404).json({ error: "Field not found" });
    }
    
    db.run("DELETE FROM fields WHERE id = ?", [id], function(err) {
      if (err) {
        console.error("Error deleting field:", err);
        return res.status(500).json({ error: "Failed to delete field" });
      }
      
      res.json({ 
        message: "Field deleted successfully",
        deleted_id: parseInt(id)
      });
    });
  });
});

module.exports = router;
