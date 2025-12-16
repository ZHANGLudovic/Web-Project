const express = require("express");
const router = express.Router();
const db = require("../database");

// Créer une nouvelle réservation avec gestion des créneaux horaires
router.post("/", (req, res) => {
  const { user_id, field_id, reservation_date, start_time, end_time, total_price, notes } = req.body;

  console.log("Creating reservation with data:", { user_id, field_id, reservation_date, start_time, end_time, total_price });

  if (!user_id || !field_id || !reservation_date || !start_time || !end_time || total_price === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Générer tous les créneaux horaires entre start_time et end_time
  const timeSlots = [];
  const [startHour] = start_time.split(':').map(Number);
  const [endHour] = end_time.split(':').map(Number);
  
  for (let hour = startHour; hour < endHour; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
  }

  console.log("Time slots to reserve:", timeSlots);

  db.serialize(() => {
    db.run("BEGIN TRANSACTION");

    // Vérifier si des créneaux sont déjà réservés
    const checkQuery = `
      SELECT time_slot 
      FROM time_slots 
      WHERE field_id = ? AND reservation_date = ? AND time_slot IN (${timeSlots.map(() => '?').join(',')})
    `;

    db.all(checkQuery, [field_id, reservation_date, ...timeSlots], (err, conflicts) => {
      if (err) {
        db.run("ROLLBACK");
        console.error("Error checking availability:", err);
        return res.status(500).json({ error: "Failed to check availability" });
      }

      if (conflicts && conflicts.length > 0) {
        db.run("ROLLBACK");
        const conflictSlots = conflicts.map(c => c.time_slot);
        console.log("Conflict detected with slots:", conflictSlots);
        return res.status(409).json({ 
          error: "Some time slots are already reserved",
          conflicting_slots: conflictSlots
        });
      }

      // Insérer la réservation
      const insertReservation = `
        INSERT INTO reservations (user_id, field_id, reservation_date, start_time, end_time, total_price, notes, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'confirmed')
      `;

      db.run(insertReservation, [user_id, field_id, reservation_date, start_time, end_time, total_price, notes || null], function(err) {
        if (err) {
          db.run("ROLLBACK");
          console.error("Error creating reservation:", err);
          return res.status(500).json({ error: "Failed to create reservation" });
        }

        const reservationId = this.lastID;
        console.log("Reservation created with ID:", reservationId);

        // Insérer tous les créneaux horaires
        const insertSlot = `INSERT INTO time_slots (reservation_id, field_id, reservation_date, time_slot) VALUES (?, ?, ?, ?)`;
        let completed = 0;
        let hasError = false;

        if (timeSlots.length === 0) {
          db.run("COMMIT");
          return fetchAndReturnReservation(reservationId, res);
        }

        timeSlots.forEach(slot => {
          db.run(insertSlot, [reservationId, field_id, reservation_date, slot], (err) => {
            if (err && !hasError) {
              hasError = true;
              db.run("ROLLBACK");
              console.error("Error inserting time slot:", err);
              return res.status(500).json({ error: "Failed to reserve time slots" });
            }

            completed++;
            if (completed === timeSlots.length && !hasError) {
              db.run("COMMIT", (err) => {
                if (err) {
                  console.error("Error committing transaction:", err);
                  return res.status(500).json({ error: "Failed to finalize reservation" });
                }
                
                console.log("All time slots reserved successfully");
                fetchAndReturnReservation(reservationId, res);
              });
            }
          });
        });
      });
    });
  });
});

function fetchAndReturnReservation(reservationId, res) {
  const selectQuery = `
    SELECT 
      r.*,
      f.nom as field_name,
      f.sport,
      f.adresse,
      f.ville,
      f.image_url,
      f.prix
    FROM reservations r
    JOIN fields f ON r.field_id = f.id
    WHERE r.id = ?
  `;

  db.get(selectQuery, [reservationId], (err, reservation) => {
    if (err) {
      console.error("Error fetching created reservation:", err);
      return res.status(201).json({
        message: "Reservation created successfully",
        reservation_id: reservationId
      });
    }

    res.status(201).json({
      message: "Reservation created successfully",
      reservation_id: reservationId,
      reservation: reservation
    });
  });
}

// Récupérer toutes les réservations d'un utilisateur
router.get("/user/:userId", (req, res) => {
  const { userId } = req.params;
  console.log("Fetching reservations for user:", userId);

  const query = `
    SELECT 
      r.*,
      f.nom as field_name,
      f.sport,
      f.adresse,
      f.ville,
      f.image_url,
      f.prix
    FROM reservations r
    JOIN fields f ON r.field_id = f.id
    WHERE r.user_id = ?
    ORDER BY r.reservation_date DESC, r.start_time DESC
  `;

  db.all(query, [userId], (err, rows) => {
    if (err) {
      console.error("Error fetching reservations:", err);
      return res.status(500).json({ error: "Failed to fetch reservations" });
    }

    console.log(`Found ${rows.length} reservations for user ${userId}`);
    res.json(rows);
  });
});

// Supprimer une réservation
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;

  console.log(`Attempting to delete reservation ${id} for user ${user_id}`);

  db.serialize(() => {
    // Vérifier que la réservation appartient à l'utilisateur
    db.get("SELECT * FROM reservations WHERE id = ? AND user_id = ?", [id, user_id], (err, reservation) => {
      if (err) {
        console.error("Error finding reservation:", err);
        return res.status(500).json({ error: "Failed to find reservation" });
      }

      if (!reservation) {
        return res.status(404).json({ error: "Reservation not found or unauthorized" });
      }

      // Compter les créneaux avant suppression
      db.get("SELECT COUNT(*) as count FROM time_slots WHERE reservation_id = ?", [id], (err, result) => {
        if (err) {
          console.error("Error counting time slots:", err);
        }

        const slotsCount = result ? result.count : 0;
        console.log(`Found ${slotsCount} time slots to delete for reservation ${id}`);

        // Supprimer la réservation (les time_slots seront supprimés automatiquement par CASCADE)
        db.run("DELETE FROM reservations WHERE id = ?", [id], function(err) {
          if (err) {
            console.error("Error deleting reservation:", err);
            return res.status(500).json({ error: "Failed to delete reservation" });
          }

          if (this.changes === 0) {
            return res.status(404).json({ error: "Reservation not found" });
          }

          // Vérifier que les time_slots ont bien été supprimés
          db.get("SELECT COUNT(*) as count FROM time_slots WHERE reservation_id = ?", [id], (err, afterResult) => {
            const remainingSlots = afterResult ? afterResult.count : 0;
            console.log(`Reservation ${id} deleted. Slots before: ${slotsCount}, after: ${remainingSlots}`);
            
            console.log(`Reservation ${id} deleted successfully, ${slotsCount} time slots freed`);
            res.json({ 
              message: "Reservation deleted successfully",
              freed_slots: slotsCount
            });
          });
        });
      });
    });
  });
});

module.exports = router;
