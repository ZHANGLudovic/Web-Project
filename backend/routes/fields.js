const express = require("express");
const router = express.Router();
const db = require("../database");

// Get all fields - SIMPLIFIED RESPONSE
router.get("/", (req, res) => {
  const query = "SELECT * FROM fields ORDER BY created_at DESC";
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Error fetching fields:", err);
      return res.status(500).json({ error: "Failed to fetch fields" });
    }
    
    console.log(`Sending ${rows.length} fields with image_url`);
    // Return ONLY the array, not wrapped
    res.json(rows);
  });
});

// Get available time slots for a field on a specific date
router.get("/:id/available-slots", (req, res) => {
  const { id } = req.params;
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ error: 'Date parameter is required' });
  }

  console.log(`Fetching available slots for field ${id} on ${date}`);

  const query = `
    SELECT time_slot 
    FROM time_slots 
    WHERE field_id = ? AND reservation_date = ?
  `;

  db.all(query, [id, date], (err, rows) => {
    if (err) {
      console.error('Error fetching reserved slots:', err);
      return res.status(500).json({ error: 'Failed to fetch available slots' });
    }

    const reservedSlots = rows.map(row => row.time_slot);
    
    // Generate all possible time slots (8:00 to 22:00)
    const allSlots = [];
    for (let hour = 8; hour < 22; hour++) {
      allSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    }

    const availableSlots = allSlots.filter(slot => !reservedSlots.includes(slot));

    console.log(`Reserved slots: ${reservedSlots.length}, Available slots: ${availableSlots.length}`);

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
  db.get('SELECT * FROM fields WHERE id = ?', [req.params.id], (err, field) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!field) {
      return res.status(404).json({ error: 'Field not found' });
    }
    
    // Get reviews
    db.all(
      `SELECT r.*, u.username FROM reviews r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.field_id = ? 
       ORDER BY r.created_at DESC`,
      [req.params.id],
      (err, reviews) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        
        res.json({
          ...field,
          reviews: reviews || []
        });
      }
    );
  });
});

// Delete field by ID (admin only)
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  
  console.log(`Attempting to delete field ${id}`);
  
  // First, check if field exists
  db.get("SELECT * FROM fields WHERE id = ?", [id], (err, field) => {
    if (err) {
      console.error("Error finding field:", err);
      return res.status(500).json({ error: "Failed to find field" });
    }
    
    if (!field) {
      return res.status(404).json({ error: "Field not found" });
    }
    
    // Delete the field
    db.run("DELETE FROM fields WHERE id = ?", [id], function(err) {
      if (err) {
        console.error("Error deleting field:", err);
        return res.status(500).json({ error: "Failed to delete field" });
      }
      
      console.log(`Field ${id} deleted successfully`);
      res.json({ 
        message: "Field deleted successfully",
        deleted_id: id
      });
    });
  });
});

module.exports = router;
